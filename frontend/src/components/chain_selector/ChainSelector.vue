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
            availableChains: ['sui:mainnet', 'sui:testnet', 'sui:devnet'],
            selectedLabel: '...',
            displayAddress: '',

            settings: {
                'sui:localnet': {
                    packageId: '0x8929b38436b342c0bc325f269b019a2f06836fbbdfec23a1426ebd86cfaecfde',
                    firstVPackageId: '0xf8fdf01acdbad7f73da30ba38cd52ff2a1f0496bd6613fabf0f1e3781cfb66d1',
                    liquidStoreId: '0x376bc47e61c45ed0d21bd0891f97ed96c8591b3cea5be4e174d3f207b1ab9cb3',
                },
                'sui:devnet': {
                    packageId: '0x6d9b392ac3d96fd0779d825418680c91ccfa5a15ba20c0c7321df9bde0690963',
                    liquidStoreId: '0x4a6d93a6ead0f0c47b5e75e25ef28bd7080aa89151b61ec2e6f8bb24bc135ac3',
                },
                'sui:testnet': {
                    packageId: '0xc797288b493acb9c18bd9e533568d0d88754ff617ecc6cc184d4a66bce428bdc',
                    liquidStoreId: '0x884e328097377ae266feeda19ed774092dc9035fb82755bfd61cca4dd2c4c366',
                },
                'sui:mainnet': {
                    packageId: '0x67e77b4e79e8c157e42c18eecf68e25047f6f95e657bd65387189411f2898ce3',
                    liquidStoreId: '0x78d9273a9f774a2bd6c35cf79fbcf4029ee076cc249207610a3bcc0d6d0efc34',
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
            this.$q.localStorage.set('preferredAdapter', null);
            
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
        if ((''+location.host).indexOf('localhost') != -1) {
            this.availableChains.push('sui:localnet');
        }

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