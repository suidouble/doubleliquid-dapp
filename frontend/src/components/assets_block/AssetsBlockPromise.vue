<template>


    <q-item clickable v-ripple>
        <q-item-section @click="openOnExplorer" >{{ displayAddress }}</q-item-section>
        <q-item-section side>
            {{ leftTimeHuman }}
        </q-item-section>
        <q-item-section side>
            <q-btn unelevated :disable="!isReady" color="primary" :label="displayAmount ? ('Get '+displayAmount+' SUI') : 'Get SUI'" size="sm" @click="doFulfill" :loading="isLoading" />
        </q-item-section>
    </q-item>
    <!-- <q-card class="" square flat>
        <q-card-section >
            <div class="text-subtitle2">
                <q-btn round color="primary" size="xs" flat icon="open_in_new" style="float: right" @click="openOnExplorer" />
                {{ displayAddress }}<br/>

                {{  msTillReady }} - {{ readyAtEpoch }} - {{ curEpoch }}<br/>
                {{ leftTimeHuman }}
                <q-btn unelevated :disable="!isReady" color="primary" label="Fulfill" size="md" @click="doFulfill" :loading="isLoading" />
            </div>
            
        </q-card-section>
    </q-card> -->

</template>

<style lang="css">
</style>

<script>

export default {
	name: 'AssetsBlockPromise',
	props: {
        suiMaster: {
            type: Object,
            default: null,
        },
        promise: {
            type: Object,
            default: null,
        },
	},
	data() {
		return {
			isLoading: false,
            responses: [],
            responsesDict: {},

            isReady: false,
            msTillReady: 0,
            readyAtEpoch: 0,
            curEpoch: 0,
            leftTimeHuman: '',

            displayAmount: '',
		}
	},
    emits: [],
	watch: {
        systemEpoch: function() {
            this.recalcValues();
        },
	},
	computed: {
		displayAddress() {
			return (''+this.promise.address).substr(0,6)+'...'+(''+this.promise.address).substr(-4);
		},
        systemEpoch: function() {
            return ''+this.$store.sui.current_epoch+'_'+this.$store.sui.epoch_duration+'_'+this.$store.sui.current_epoch_started_at;
        },
	},
	components: {
	},
	methods: {
        async doFulfill() {
            this.isLoading = true;
            try {
                const res = await this.$store.sui.doubleLiquid.fulfill(this.promise.address);
                if (res && res.ldAmountReceived) {
                    this.$q.notify({
                        progress: true,
                        color: "positive",
                        multiLine: true,
                        textColor: "dark",
                        message: 'Successfully exchanged',
                    });

                    this.$store.sui.refreshBalances();
                }
            } catch (e) {
                console.error(e);
            }
            this.isLoading = false;
        },
        async recalcValues() {
            const fulfilledAtEpoch = parseInt(this.promise.fields.fulfilled_at_epoch, 10);
            this.readyAtEpoch = fulfilledAtEpoch;

            const currentEpoch = parseInt(this.$store.sui.current_epoch, 10);
            this.curEpoch = currentEpoch;
            if (fulfilledAtEpoch <= currentEpoch) {
                this.isReady = true;
            } else {
                this.isReady = false;

                clearInterval(this.__updateTimeHumanInterval);
                this.__updateTimeHumanInterval = setInterval(this.updateTimeHumanInterval, 1000);
            }

            const amount = await this.$store.sui.amountToString(parseInt(this.promise.fields.sui_amount, 10));
            this.displayAmount = parseFloat(amount, 10).toFixed(3);
        },
        updateTimeHumanInterval() {
            const fulfilledAtEpoch = parseInt(this.promise.fields.fulfilled_at_epoch, 10);
            this.readyAtEpoch = fulfilledAtEpoch;
            const currentEpoch = parseInt(this.$store.sui.current_epoch, 10);
            this.curEpoch = currentEpoch;

            if (fulfilledAtEpoch <= currentEpoch) {
                this.isReady = true;
                return;
            }

            const epochDuration = parseInt(this.$store.sui.epoch_duration, 10);
            const timeNow = (new Date()).getTime();
            const thisEpochTimeLeft = epochDuration - (timeNow - (this.$store.sui.current_epoch_started_at).getTime());
            let fullEpochs = Math.abs(fulfilledAtEpoch - currentEpoch) - 1;
            if (fullEpochs < 0) {
                fullEpochs = 0;
            }

            const fullEpochsTime = fullEpochs * epochDuration;
            this.msTillReady = fullEpochsTime + thisEpochTimeLeft;
            if (this.msTillReady > 0) {
                this.leftTimeHuman = this.secondsToHuman(this.msTillReady / 1000);
                this.isReady = false;
            } else {
                this.leftTimeHuman = '';
                this.isReady = true;
            }

        },
        secondsToHuman(seconds) {
            let interval = Math.floor(seconds / 31536000);
            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        },
        openOnExplorer() {
            let network = 'mainnet';
            try {
                network = (''+this.suiMaster.signer.getCurrentChain()).split('sui:').join('');
                network = network.split('localnet').join('local');
            } catch (e) {
                console.error(e);
            }

            window.open('https://suiexplorer.com/object/'+this.promise.address+'?network='+network, '_blank');
        },
	},
	beforeMount: function() {
	},
	mounted: async function() {
        setTimeout(()=>{
        this.recalcValues();

        }, 2000);
	},
    unmounted: function() {
        clearInterval(this.__updateTimeHumanInterval);
    },
}
</script>
