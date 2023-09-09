<template>

    <div>
        <q-btn-dropdown stretch flat :label="selectedLabel">
            <q-list>
                <q-item @click="selectChain(availableChain)" clickable v-close-popup tabindex="1" v-for="availableChain in availableChains" :key="availableChain">
                    <q-item-section>
                        <q-item-label>{{availableChain}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator/>
                <q-item @click="doLogout" clickable v-close-popup tabindex="999">
                    <q-item-section>
                        <q-item-label>Disconnect</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>

        </q-btn-dropdown>
        <SignInWithSui v-if="defaultChain" @adapter="onAdapter" :defaultChain="defaultChain" @wrongchain="onWrongChain" @suiMaster="onSuiMaster" ref="sui" :visible="false" />
    </div>

</template>
<script>
import { SignInWithSui } from 'vue-sui';

export default {
	name: 'ChainSelector',
    components:{
        SignInWithSui,
    },
	props: {
	},
	data() {
		return {
            defaultChain: '',
            availableChains: ['sui:mainnet', 'sui:testnet', 'sui:devnet','sui:localnet'],
            selectedLabel: '...',
            displayAddress: '',

            settings: {
                'sui:localnet': {
                    packageId: '0x716f3179dd857994782e77e65b7d545260bff54aa83a1c1fab94b601e6868337',
                    liquidStoreId: '0xa5809d910001c87cbd9a635dc5002741f01e7a222f85628c85fb6c4e19d09d2d',
                },
            },
		}
	},
	watch: {
        connectionId: function() {
            const connectedChain = this.$store.sui.connectedChain;
            this.selectedLabel = (this.displayAddress ? (''+this.displayAddress+' at ') : '')+(''+connectedChain).split('sui:').join('');
        },
	},
	methods: {
        doLogout() {
            this.$q.localStorage.set('preferredAdapter', null);
            location.reload();
        },
        onAdapter(adapter) {
            this.$q.localStorage.set('preferredAdapter', adapter.name);
        },
        tryToAutoConnect() {
            const prefferedAdapter = this.$q.localStorage.getItem('preferredAdapter');
            if (prefferedAdapter) {
                this.$refs.sui.adapters.forEach((adapter)=>{
                    if (adapter.name == prefferedAdapter) {
                        this.$refs.sui.onAdapterClick(adapter);
                    }
                });
            }
        },
        onWrongChain(wrongChainName) {
            this.$q.notify({
                progress: true,
                color: "warning",
                multiLine: true,
                textColor: "dark",
                message: 'Different chain is selected in wallet extension settings: '+wrongChainName+' You may switch it in extension, but for now we are redirecting you to it.',
                // color: 'primary',
            });

            setTimeout(()=>{
                this.$q.localStorage.set('preferredChain', wrongChainName);
                location.reload();
            }, 2000);
        },
        selectChain(chain) {
            this.$q.localStorage.set('preferredChain', chain);
            this.selectedLabel = chain;
            location.reload();
        },
        pickTheChain() {
            const asInStorage = this.$q.localStorage.getItem('preferredChain');
            if (asInStorage) {
                this.defaultChain = asInStorage;
            } else {
                this.defaultChain = 'sui:mainnet';
            }
        },
        onSuiMaster(suiMaster) {
            this.$store.sui.setSuiMaster(suiMaster, this.settings[suiMaster.connectedChain]);
            if (suiMaster.address) {
                this.displayAddress = this.$refs.sui.displayAddress;
            } else {
                this.displayAddress = '';
            }
        },
        async request() {
            await this.$refs.sui.onClick();
        }
	},
	computed: {
        connectionId: function() {
            return this.$store.sui.connectionId;
        },
	},
	unmounted: function() {
	},
	mounted: function(){
        this.$store.sui.$onAction((params)=>{
            if (params.name == 'request') {
                this.request();
            }
        });
        
        setTimeout(()=>{
            this.pickTheChain();

            setTimeout(()=>{
                this.tryToAutoConnect();
            }, 500);
        }, 500);
	}
}
</script>
<style lang="css">



</style>