<template>

	<div>

        <q-card
        class="my-card col-12 col-md-4"
        bordered
        flat
        >
            <q-card-section class="rewards_simulator">

                <div class="text-h6 text-center non-selectable">Rewards simulator</div>

                <div class="q-pt-md non-selectable">

                    <q-input outlined v-model="simulatorInput" placeholder="Sui">
                    <template v-slot:prepend>
                    <q-icon name="water_drop" color="primary" /><span class="text-primary">SUI</span> 
                    </template>
                    </q-input>

                </div>

                <div class="row q-pa-sm non-selectable">
                <div class="col text-center col-6 text-left">
                    <strong>Best Price</strong>
                </div>
                <div class="col col-6 text-right">
                    1 Staked SUI = {{ currentPrice.toFixed(3) }} SUI
                </div>
                </div>
                <div class="row q-pb-xs non-selectable">
                <div class="col text-center col-12 text-center">
                    <strong>Projected yield <q-chip 
                        icon-right="info" color="primary" text-color="white" style="background-color: rgba(48, 164, 223, 0.623); color: var(--text-color)"
                                >APY {{ projectedApy.toFixed(3) }}%
                    
                        <q-tooltip>The displayed APY represents estimate based on the moving averate price grow over the last 7 epochs</q-tooltip>
                        </q-chip></strong>
                    <!-- linear-gradient(to right,#fff,rgba(48, 164, 223, 0.623)) -->
                </div>
                </div>

                <div class="text-h6 text-center non-selectable">
                    Rewards summary
                </div>

                <div class="text-h6 text-subtitle2 text-center non-selectable">
                    With staking rewards compounding, the value of iSUI grows,<br/>resulting in a greater amount of SUI per iSUI over time.
                </div>

            </q-card-section>

            <q-card-section class="q-pt-none non-selectable">

                <div class="row">
                <div class="col text-center col-6">
                    <strong>You spend</strong><br/>

                    {{ stats.now.sui.toFixed(3) }} SUI
                </div>
                <div class="col col-6 text-center">
                    <strong>You get  </strong><br/>

                    {{ stats.now.isui.toFixed(3) }} iSUI<br/>
                    <strong>equals</strong>
                </div>
                </div>


                <div class="row">
                <div class="col text-center col-6">
                    <strong>in 7 days</strong>
                </div>
                <div class="col col-6 text-center">
                    {{ stats.d7.sui.toFixed(3) }} SUI
                </div>
                </div>

                <div class="row">
                <div class="col text-center col-6">
                    <strong>in 1 month</strong>
                </div>
                <div class="col col-6 text-center">
                    {{ stats.d31.sui.toFixed(3) }} SUI
                </div>
                </div>

                <div class="row">
                <div class="col text-center col-6">
                    <strong>in a year</strong>
                </div>
                <div class="col col-6 text-center">
                    {{ stats.d365.sui.toFixed(3) }} SUI
                </div>
                </div>

            </q-card-section>
        </q-card>

        <q-card
        class="my-card col-12 col-md-4 q-mt-sm non-selectable"
        bordered
        flat
        >
            <q-card-section>
                    <ul class="q-px-md q-my-xs">
                        <li>Full control over your tokens</li>
                        <li>No minimum stake. No minimum unstake</li>
                        <li>Unlock your stake, receive a tokenized version of your position, and use it in DeFi</li>
                        <li>Permissionless delegation formula with more than 100 validators optimizing APY over time</li>
                        <li>Stake and delayed unstake with no charge</li>
                        <li>Instant unstake (subject for availability) with 2% fee (half of it goes back to the pool)</li>
                        <li>Delayed unstake Promise is a tradeable NFT</li>
                        <li>0.5% p.a. fee for ongoing management</li>
                    </ul>
            </q-card-section>
        </q-card>
	</div>

</template>

<script>

export default {
	name: 'RewardsCalculator',
	data() {
		return {
            simulatorInput: '10.00',
            rateGrowthPer1d: 1.00010958904,
            currentPrice: 1.1,

            projectedApy: 1,

            stats: {
                now: { sui: 0, isui: 0 },
                d7: { sui: 0, },
                d31: { sui: 0, },
                d365: { sui: 0, },
            },
		}
	},
	computed: {
        suiState: function() {
            return ''+this.$store.sui.rateGrowthPer1d+'_'+this.$store.sui.current_price;
        },
	},
	components: {
	},
	watch:{
        simulatorInput: function() {
            // if ((''+parseFloat(this.simulatorInput, 10)) != (''+this.simulatorInput)) {
            //     this.simulatorInput = ''+(''+this.simulatorInput).replace(/[^\d.]/g, '');
            // }

            this.simulatorInput = parseFloat((''+this.simulatorInput).replace(/[^\d.-]/g, ''));  // ''+(''+this.simulatorInput).replace(/[^\d.]/g, '');
            if (isNaN(this.simulatorInput)) {
                this.simulatorInput = '10';
            }
            this.simulate();
            // this.simulatorInput = ''+parseFloat(this.simulatorInput.replace(/[^0-9.]/g,''), 10).toFixed(3);
        },
        suiState: function() {
            this.simulate();
        },
	},
	mounted() {
        this.simulate();
	},
	methods: {
        simulate() {
            this.rateGrowthPer1d = this.$store.sui.rateGrowthPer1d;
            this.currentPrice = this.$store.sui.current_price;

            if (!this.currentPrice) {
                this.currentPrice = 1;
            }
            if (this.rateGrowthPer1d < 1) {
                this.rateGrowthPer1d = 1;
            }

            this.stats.now.sui = parseFloat(this.simulatorInput, 10);
            this.stats.now.isui = this.stats.now.sui / this.currentPrice;

            const priceIn7Days = this.currentPrice * (Math.pow(this.rateGrowthPer1d, 7));
            this.stats.d7.sui = this.stats.now.isui * priceIn7Days;

            const priceIn31Days = this.currentPrice * (Math.pow(this.rateGrowthPer1d, 31));
            this.stats.d31.sui = this.stats.now.isui * priceIn31Days;

            const priceIn365Days = this.currentPrice * (Math.pow(this.rateGrowthPer1d, 365));
            this.stats.d365.sui = this.stats.now.isui * priceIn365Days;

            this.projectedApy = (this.stats.d365.sui / this.stats.now.sui * 100) - 100;
        },
	},
	beforeCreate() {
	}
}
</script>

<style >

.rewards_simulator .q-field__native {
        text-align: right;
        color: var(--text-color) !important;
        font-weight: bold !important;
        font-size: 20px !important;
}

.rewards_simulator .q-field__control .text-primary {
    font-size: 16px;
}


</style>