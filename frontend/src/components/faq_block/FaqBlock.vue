<template>

        <div class="faq_block">

                <h6 style="margin: 0; padding: 0 0 0 15px;">FAQ</h6>

                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>What is staking?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            The Sui platform relies on Delegated Proof-of-Stake to determine the set of validators who process transactions. 
                            Within each epoch(currently, an epoch is 24 hours), operations are processed by a fixed set of validators, 
                            each with a specific amount of stake from SUI token holders. A validator's share of the total stake is 
                            relevant in that it determines each validator’s share of voting power for processing transactions. 
                            Staking SUI implies the SUI tokens are locked for the entire epoch. At the end of each epoch, 
                            the protocol distributes stake rewards to participants of the proof-of-stake mechanism. 
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>What is liquid staking?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            Liquid staking is an alternative to native Sui staking. It allows users to benefit from a Sui protocol's 
                            staking rewards while receiving a special token (iSUI) for their staked SUI that can be used in DeFi, 
                            making their staked assets liquid.
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>What is DoubleLiquid?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            DoubleLiquid is a liquid staking protocol built on Sui. You can stake your SUI with DoubleLiquid 
                            using an automated staking strategy to contribute to the decentralisation of the Sui blockchain. 
                            When staking with DoubleLiquid, you receive an equivalent value of DoubleLiquidSui ( iSUI ) tokens 
                            that you can store in your wallet, use in DeFi or exchange back to SUI with DoubleLiquid.
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>Where are my SUI tokens?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            When you deposit your SUI, DoubleLiquid smart contract delegates them into SUI validators. 
                            You will receive iSUI tokens back in your wallet. iSUI can be unstaked to receive your 
                            SUI tokens back, plus rewards. iSUI increases in value every epoch relative to SUI.
                        </q-card-section>
                    </q-card>
                </q-expansion-item>


                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>Are staking rewards staked automatically?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            Staking rewards are compounded automatically into the iSUI.
                        </q-card-section>
                    </q-card>
                </q-expansion-item>


                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>How long does it take to stake and unstake?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            <ul>
                                <li>You can get iSUI in exchange for your SUI immediately. Internally, SUI tokens will be distributed to validator pools within the epoch</li>
                                <li>Delayed unstake takes up to 2 epochs (48 hours). It may be anything between 24 and 48 hours depending on the current time</li>
                                <li>Immediate unstake is... instant. But it may not be always available for high amounts</li>
                            </ul>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>


                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>What fees does DoubleLiquid charge?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            <ul>
                                <li>Deposit Fee: 0%</li>
                                <li>Delayed Unstake: 0%</li>
                                <li>Instant Unstake: 2%</li>
                                <li>Maintenance Fee: 0.5% of iSUI per year</li>
                            </ul>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

                <q-expansion-item>
                    <template v-slot:header>  
                        <q-item-section>
                            <q-item-label>Sounds great. How does it work?</q-item-label>
                        </q-item-section>
                    </template>

                    <q-card>
                        <q-card-section>
                            <ul>
                                <li>Check out the <a href="https://www.youtube.com/watch?v=a4WDbK9iCa0" target="_blank">demo video</a></li>
                                <li>Read the DoubleLiquid <a href="https://suidouble.github.io/dl/doubleliquid_hackpaper_v0.92.pdf" target="_blank">hackpaper</a></li>
                                <li>Take a look at the <router-link to="/simulations">simulations</router-link> we run while building it</li>
                                <li><a href="https://twitter.com/double2liquid" target="_blank">Follow us on twitter</a> and feel free to DM us with questions</li>
                            </ul>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

        </div>

</template>

<script>

export default {
	name: 'FaqBlock',
	data() {
		return {
		}
	},
	computed: {
	},
	components: {
	},
	watch:{
	},
	mounted() {
	},
	methods: {
	},
	beforeCreate() {
	}
}
</script>

<style >

    .faq_block ul {
        margin: 0;
        padding-left: 20px;
    }
    .faq_block .q-item__label {
        font-weight: bold;
    }
    .faq_block a {
        color: var(--q-primary);
    }
    .faq_block .q-expansion-item__content {
        user-select: text;
    }


</style>