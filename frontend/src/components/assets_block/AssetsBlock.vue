<template>

    <div>

        <div class="assets_top_block" :class="{isConnected: isConnected}">
                <div class="assets_top_block_not_connected non-selectable">
                    <div class="text-center q-pt-md assets_transition_container">

                    <q-btn color="primary" label="Start stacking SUI" size="lg" unelevated @click="onClickStake" />

                    <div class="connect_a_wallet">
                        or <a href="#" @click="onClickConnect">connect a wallet</a>
                    </div>

                    </div>
                </div>
                <div class="assets_top_block_connected">
                    <div class="text-left q-pt-md assets_transition_container">

                        <div class="q-pa-md non-selectable assets_block_assets" >
                        <q-list bordered separator>

                            <q-expansion-item  >
                                <template v-slot:header>  
                                    <q-item-section avatar>
                                        <q-avatar color="primary" text-color="white"><img :src="logo.sui"></q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label color="primary" >SUI</q-item-label>
                                        <q-item-label caption>SUI native token</q-item-label>
                                    </q-item-section>
                                    <q-item-section side class="relative-position">
                                        <q-item-label caption color="primary" class="asset_amount relative-position" style="display: block;">
                                            <q-spinner-dots size="20px" color="primary" v-if="amounts.sui == -1" />
                                            <span  v-if="amounts.sui != -1" >{{ parseFloat(amounts.sui, 10).toFixed(3) }}</span>
                                        </q-item-label>
                                        <q-item-label  class="not_earning">Not earning yield</q-item-label>
                                    </q-item-section>
                                </template>

                                <q-card>
                                    <q-card-section>
                                    
                                        <p class="q-pb-xs q-mb-xs">Stake SUI and earn rewards</p>
                                        <q-btn color="primary" label="Stake SUI" size="md" unelevated @click="showStakeDialog = true" />
                                    </q-card-section>
                                </q-card>
                            </q-expansion-item>

                            <q-expansion-item >
                                <template v-slot:header>  
                                    <q-item-section avatar>
                                        <q-avatar color="primary" text-color="white"><img :src="logo.isui"></q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label color="primary" >iSUI</q-item-label>
                                        <q-item-label caption>DoubleLiquid staked SUI</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label caption color="primary" class="asset_amount">
                                            <q-spinner-dots size="20px" color="primary" v-if="amounts.isui == -1" />
                                            <span  v-if="amounts.isui != -1" >{{ parseFloat(amounts.isui, 10).toFixed(3) }}</span>
                                        </q-item-label>
                                        <q-item-label v-if="projectedApy == -1"><span class="text-primary" v-if="projectedApy"><q-spinner-dots size="20px" color="primary" /> APY</span></q-item-label>
                                        <q-item-label v-if="projectedApy != -1"><span class="text-primary" v-if="projectedApy">~{{ projectedApy.toFixed(3) }}% APY</span></q-item-label>
                                    </q-item-section>
                                </template>

                                <q-card>
                                    <q-card-section>
                                        <div class="q-gutter-sm">
                                            <q-btn color="primary" label="Unstake iSUI" outline size="md"  @click="unstakeDialogIsFast = false; showUnstakeDialog = true">
                                            </q-btn>
                                            <q-btn color="primary" label="Fast Unstake" outline size="md"  @click="unstakeDialogIsFast = true; showUnstakeDialog = true">
                                                <q-badge color="orange" floating>2% fee</q-badge>
                                            </q-btn>
                                            <q-btn color="primary" label="Add Stake" size="md" unelevated @click="showStakeDialog = true" />
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </q-expansion-item>

                            <q-expansion-item :disable="(promises.length == 0)" v-model="promisesDivExpanded">
                                <template v-slot:header>  
                                    <q-item-section avatar>
                                        <q-avatar color="primary" text-color="white" class="promised_icon"><img :src="logo.sui"></q-avatar>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label color="primary" >DoubleLiquid Promised SUI</q-item-label>
                                        <q-item-label caption>Delayed Unstake</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-item-label caption color="primary" v-if="promisesTotalAmount == -1">
                                            <q-spinner-dots size="20px" color="primary" />
                                        </q-item-label>
                                        <q-item-label caption color="primary"  v-if="promisesTotalAmount > 0">
                                            {{ promises.length }} <span v-if="promises.length > 1">items</span><span v-if="promises.length == 1">item</span>
                                        </q-item-label>
                                        <q-item-label caption color="primary"  v-if="promisesTotalAmount == 0">
                                           &nbsp;
                                        </q-item-label>
                                        <q-item-label v-if="promisesTotalAmount != -1"><span class="text-primary asset_amount">{{ parseFloat(promisesTotalAmount, 10).toFixed(3) }} SUI</span></q-item-label>
                                        <q-item-label v-if="promisesTotalAmount == -1"><q-spinner-dots size="20px" color="primary" /></q-item-label>
                                    </q-item-section>
                                </template>

                                <q-card>
                                    <q-card-section>


                                        <div>
                                            <q-list bordered separator>
                                            <template v-for="(promise) in promises" v-bind:key="promise.address">
                                                <AssetsBlockPromise :promise="promise" :suiMaster="suiMaster" />
                                            </template>
                                            </q-list>
                                        </div>
                                        
                                    </q-card-section>
                                </q-card>
                            </q-expansion-item>


                        </q-list>
                        </div>

                    </div>
                </div>
        </div>

        <StakePopup :show="showStakeDialog" @hide="showStakeDialog = false"/>
        <UnstakePopup :show="showUnstakeDialog" @hide="showUnstakeDialog = false" :fast="unstakeDialogIsFast" />
        <!-- <SignInWithSui :defaultChain="defaultChain" @wrongchain="onWrongChain" @suiMaster="onSuiMaster" ref="sui" :visible="false" /> -->
	</div>

</template>

<script>
import SuiLogo from '../../assets/sui.png';
import ISuiLogo from '../../assets/isui.png';

// import { SignInWithSui } from 'vue-sui';
import StakePopup from './StakePopup.vue';
import UnstakePopup from './UnstakePopup.vue';

import AssetsBlockPromise from './AssetsBlockPromise.vue';

export default {
	name: 'AssetsBlock',
	props: {
        defaultChain: {
            type: String,
            default: 'sui:mainnet',
        },
	},
	data() {
		return {
            isConnected: false,
            logo: {
                sui: SuiLogo,
                isui: ISuiLogo,
            },
            amounts: {
                sui: -1,
                isui: -1,
            },
            projectedApy: -1,
            promises: [],
            promisesTotalAmount: '-1',

            showStakeDialog: false,
            showUnstakeDialog: false,
            unstakeDialogIsFast: false,

            suiMaster: null,

            promisesDivExpanded: false,
		}
	},
	computed: {
        connectionId: function() {
            return this.$store.sui.connectionId;
        },
        connectionAmounts: function() {
            return ''+this.$store.sui.amount_sui_string+'_'+this.$store.sui.amount_isui_string+'_'+this.$store.sui.apy+'_'+this.$store.sui.promises_total_amount_string;
        },
	},
	components: {
        StakePopup,
        UnstakePopup,
        AssetsBlockPromise,
        // SignInWithSui,
	},
	watch:{
        connectionId: function() {
            this.onSuiConnectionChanged();
        },
        connectionAmounts: function() {
            this.amounts.sui = this.$store.sui.amount_sui_string;
            this.amounts.isui = this.$store.sui.amount_isui_string;

            this.projectedApy = this.$store.sui.apy;
            this.promises = this.$store.sui.promises;

            // if (!this.promises || !this.promises.length) {
            //     this.__hidePromisesDivTimeout = setTimeout(()=>{
            //         this.promisesDivExpanded = false;
            //     }, 2000);
            // } else {
            //     clearTimeout(this.__hidePromisesDivTimeout);
            // }

            this.promisesTotalAmount = this.$store.sui.promises_total_amount_string;
        },
	},
	mounted() {
        // setTimeout(()=>{ this.onSuiConnectionChanged(); }, 10);
	},
	methods: {
        async onSuiConnectionChanged() {
            const suiMaster = this.$store.sui.suiMaster;
            console.log(suiMaster)
            if (suiMaster.address) {
                this.isConnected = true;

                await this.$store.sui.getSuiBalance();
                await this.$store.sui.doubleLiquid.initialize();
                await this.$store.sui.getTokenBalance();
                await this.$store.sui.getCurrentPrice();
                await this.$store.sui.getPromises();
                await this.$store.sui.getCurrentSystemState();

            } else {
                this.isConnected = false;
            }            

            this.suiMaster = suiMaster;
        },
        onWrongChain() {
            console.log('got wrong chain event');
        },
        onSuiMaster(suiMaster) {
            this.$store.sui.setSuiMaster(suiMaster);
        },
        onClickStake() {
            this.requestConnected();
        },
        onClickConnect() {
            this.requestConnected();
        },
        async requestConnected() {
            this.$store.sui.request();

            // let suiMaster = null;
            // try {
            //     suiMaster = await this.$refs.sui.onClick();
            // } catch (e) {
            //     console.error(e);

            //     this.notifyAboutWrongConnectedChain();
            //     return false;
            // }

            // console.log(suiMaster);
        },
        notifyAboutWrongConnectedChain() {

        },
	},
	beforeCreate() {
	}
}
</script>

<style scoped>
    .assets_block_assets {
        width: 500px;
    }
    /* .assets_top_block {
    }

    .assets_top_block.isConnected {
    } */

    .assets_top_block_not_connected {
        display: block;
    }

    .assets_top_block_connected {
        display: none;
    }

    .assets_top_block.isConnected .assets_top_block_not_connected {
        display: none;
    }

    .assets_top_block.isConnected .assets_top_block_connected {
        display: block;
    }

    .promised_icon {
        opacity: 0.6;
    }

    .asset_amount {
        font-weight: bold;
        font-size: 16px;
        color: var(--q-primary)
    }

    /* .not_earning {} */

</style>