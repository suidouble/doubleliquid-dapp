<template>

    <q-dialog v-model="showing" @hide="onHide" class="unstake_popup">
        <q-card style="overflow: hidden;">
            <q-card-section class="q-pb-xs">
                <div class="q-pt-lg">

                    <div class="">
                    <q-slider v-model="amountPercent" :min="0" :max="100" label-always  label :label-value="amountPercent + '%'"  />
                    </div>

                    <q-input outlined v-model="amount" placeholder="Sui">
                    <template v-slot:prepend>
                    <q-icon name="water_drop" style="color: var(--text-color);" /><span style="color: var(--text-color);">iSUI</span> 
                    </template>
                    </q-input>

                    <p class="text-right text-primary q-my-xs" v-if="fast">*Fast Unstake is subject to availability</p>

                </div>
            </q-card-section>
            <q-card-actions align="center" class="text-primary q-pb-md">

                <q-btn unelevated color="primary" label="Unstake" size="md" @click="doEstimate" :loading="isLoading" v-if="!fast" />
                <q-btn unelevated color="primary" label="Unstake Now" size="md" @click="doUnstake" :loading="isLoading" v-if="fast">
                    <q-badge color="orange" floating>2% fee</q-badge>
                </q-btn>

            </q-card-actions>
        </q-card>
    </q-dialog>

</template>
<script>

export default {
	name: 'UnstakePopup',
    components:{
    },
	props: {
        show: {
            type: Boolean,
            default: false,
        },
        fast: {
            type: Boolean,
            default: false,
        },
	},
	data() {
		return {
            showing: false,
            amount: '10.00',
            isLoading: false,

            availableAmount: 1,
            amountPercent: 10,
		}
	},
	watch: {
        connectionId: function() {
        },
        show: function() {
            if (this.show) {
                this.showing = true;
                this.availableAmount = this.$store.sui.amount_isui_string;
                this.amount = ''+(this.availableAmount * this.amountPercent / 100).toFixed(3);
            }
        },
        amountPercent() {
            if (this.__ignoreAmount && ( new Date() ).getTime() - this.__ignoreAmount.getTime() < 100) {

                this.__ignoreAmount = null;

            }  else {

                this.__ignoreAmount = new Date();
                this.amount = ''+(parseFloat(this.availableAmount, 10) * this.amountPercent / 100).toFixed(3); 
                if (parseFloat(this.amount, 10) > parseFloat(this.availableAmount, 10)) {
                    this.amount = this.availableAmount;
                }
            
            }
        },
        amount() {
            if (this.__ignoreAmount && ( new Date() ).getTime() - this.__ignoreAmount.getTime() < 100) {

                this.__ignoreAmount = null;

            }  else {

                this.__ignoreAmount = new Date();
                if (!this.amount) {
                    this.amount = '1.0';
                }
                if (parseFloat(this.amount, 10) > parseFloat(this.availableAmount, 10)) {
                    this.amount = this.availableAmount;
                }
                if (parseFloat(this.amount, 10) < 0) {
                    this.amount = '0.0';
                }

                this.amountPercent = Math.floor( (parseFloat(this.amount) / parseFloat(this.availableAmount, 10)) * 100 );

            }
        },
	},
	methods: {
        async doEstimate() {
            this.isLoading = true;
            await this.$store.sui.doubleLiquid.initialize();

            if (this.amount.indexOf('.') == -1) {
                this.amount = ''+this.amount + '.0';
            }

            let amount = this.amount;
            if (Math.abs(parseFloat(this.amount, 10) - parseFloat(this.availableAmount, 10)) < 0.005) {
                amount = ''+this.availableAmount;
                if (amount.indexOf('.') == -1) {
                    amount = ''+amount + '.0';
                }
            }

            const ok = await this.estimate(amount);
            if (ok) {
                await this.doUnstake();
            }

            this.isLoading = false;
        },
        async estimate(amount) {
            try {
                const res = await this.$store.sui.doubleLiquid.simulateWithdrawAndGetAmount({ amount: amount});

                console.log(res);

                let string = 'You are going to burn '+parseFloat(res.sentAmountAsString, 10)+' iSUI in exchange to a promise of '+res.gonnaRecieveAsString+' SUI ';
                string += ' going to be fulfilled in '+this.epochToDiffString(res.epoch)+'.';

                string+=" Do you want to proceed?";

                const ok = await new Promise((res)=>{
                    this.$q.dialog({
                        title: 'Confirm',
                        message: string,
                        cancel: true,
                        persistent: true
                        }).onOk(() => {
                            res(true);
                        }).onCancel(() => {
                            res(false);
                        });
                });

                return ok;
            } catch (e) {
                this.$q.notify({
                    progress: true,
                    color: "negative",
                    multiLine: true,
                    textColor: "dark",
                    message: 'Can not run estimation. Please check console for details.',
                    // color: 'primary',
                });

                console.error(e);
            }

            return false;
        },
        epochToDiffString(fulfilledAtEpoch) {
            const currentEpoch = parseInt(this.$store.sui.current_epoch, 10);
            const epochDuration = parseInt(this.$store.sui.epoch_duration, 10);
            const timeNow = (new Date()).getTime();
            const thisEpochTimeLeft = epochDuration - (timeNow - (this.$store.sui.current_epoch_started_at).getTime());
            let fullEpochs = Math.abs(fulfilledAtEpoch - currentEpoch) - 1;
            if (fullEpochs < 0) {
                fullEpochs = 0;
            }
            const fullEpochsTime = fullEpochs * epochDuration;
            const msTillReady = fullEpochsTime + thisEpochTimeLeft;

            return this.secondsToHuman(msTillReady / 1000);
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
        async processUnstake(amount) {
            if (this.fast) {
                const res = await this.$store.sui.doubleLiquid.withdraw_fast({ amount: amount});

                if (res && res.status == 'success') {
                    this.$q.notify({
                        progress: true,
                        color: "positive",
                        multiLine: true,
                        textColor: "dark",
                        message: 'Successfully unstaked '+this.amount+' iSUI',
                        // color: 'primary',
                    });

                    return true;
                }

            } else {
                const res = await this.$store.sui.doubleLiquid.withdraw({ amount: amount});

                if (res && res.status == 'success') {
                    this.$q.notify({
                        progress: true,
                        color: "positive",
                        multiLine: true,
                        textColor: "dark",
                        message: 'Successfully unstaked '+this.amount+' iSUI. Pending Promise issued. You can exchange it for SUI when it is ready.',
                        // color: 'primary',
                    });

                    return true;
                }
            }

            return false;
        },
        async doUnstake() {
            this.isLoading = true;
            await this.$store.sui.doubleLiquid.initialize();

            if (this.amount.indexOf('.') == -1) {
                this.amount = ''+this.amount + '.0';
            }

            let amount = this.amount;
            if (Math.abs(parseFloat(this.amount, 10) - parseFloat(this.availableAmount, 10)) < 0.005) {
                amount = ''+this.availableAmount;
                if (amount.indexOf('.') == -1) {
                    amount = ''+amount + '.0';
                }
            }

            try {
                await this.processUnstake(amount);

                this.onHide();
                this.showing = false;
                await this.$store.sui.refreshBalances();
            } catch(e) {
                console.error(e);
            }

            this.isLoading = false;

            this.onHide();
            this.showing = false;
        },
        onHide() {
            this.$emit('hide');
        },
	},
	computed: {
        connectionId: function() {
            return this.$store.sui.connectionId;
        },
	},
	unmounted: function() {
	},
	mounted: function(){
        if (this.show) {
            this.showing = true;
        }
	}
}
</script>
<style lang="css">

.unstake_popup .q-field__native {
        text-align: right;
        color: var(--text-color) !important;
        font-weight: bold !important;
        font-size: 20px !important;
}

.unstake_popup .q-btn {
    text-transform: none;
}

.unstake_popup .q-field__control .text-primary {
    font-size: 16px;
}

.unstake_popup .currency_name {
    color: var(--on-brand-text-color) !important;
}


</style>