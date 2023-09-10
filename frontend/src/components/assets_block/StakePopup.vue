<template>

    <q-dialog v-model="showing" @hide="onHide" class="stake_popup">
        <q-card style="overflow: hidden;">
            <q-card-section class="q-pb-xs">
                <div class="q-pt-lg">

                    <div class="">
                    <q-slider v-model="amountPercent" :min="0" :max="100" label-always  label :label-value="amountPercent + '%'"  />
                    </div>

                    <q-input outlined v-model="amount" placeholder="Sui">
                    <template v-slot:prepend>
                    <q-icon name="water_drop" color="primary" /><span class="text-primary">SUI</span> 
                    </template>
                    </q-input>



                </div>
            </q-card-section>
            <q-card-actions align="center" class="text-primary q-pb-md">
                <q-btn unelevated color="primary" label="Stake" size="md" @click="doStake" :loading="isLoading" />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>
<script>

export default {
	name: 'StakePopup',
    components:{
    },
	props: {
        show: {
            type: Boolean,
            default: false,
        }
	},
	data() {
		return {
            showing: false,
            amount: '10.00',
            isLoading: false,

            availableAmount: 1,
            amountPercent: 75,
		}
	},
	watch: {
        connectionId: function() {
        },
        show: function() {
            if (this.show) {
                this.showing = true;
                this.availableAmount = this.$store.sui.amount_sui_string;
                this.amount = ''+(this.availableAmount * this.amountPercent / 100).toFixed(2);
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
        async doStake() {
            this.isLoading = true;
            await this.$store.sui.doubleLiquid.initialize();

            if (this.amount.indexOf('.') == -1) {
                this.amount = ''+this.amount + '.0';
            }

            try {
                
                const res = await this.$store.sui.doubleLiquid.deposit({ amount: this.amount });

                if (res && res.status == 'success') {
                    this.$q.notify({
                        progress: true,
                        color: "positive",
                        multiLine: true,
                        textColor: "dark",
                        message: 'Successfully staked '+this.amount+' SUI. Updating iSUI amount',
                        // color: 'primary',
                    });
                }

                await this.$store.sui.refreshBalances();

            } catch(e) {
                console.error(e);
            }

            this.isLoading = false;

            this.showing = false;
            this.onHide();
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

.stake_popup .q-field__native {
        text-align: right;
        color: var(--text-color) !important;
        font-weight: bold !important;
        font-size: 20px !important;
}

.stake_popup .q-field__control .text-primary {
    font-size: 16px;
}


</style>