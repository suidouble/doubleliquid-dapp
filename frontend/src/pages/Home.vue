<template>

  <div>
    <h3 class="text-center">Secure SUI and earn <br/>rewards without your funds <br/>locked in</h3>

    <h5 class="text-center">Simplified and secure participation in SUI staking</h5>

    <div class="text-center">

        <AssetsBlock />
        
    </div>
    

    <div class="row justify-center q-gutter-md q-mt-md">
        <RewardsCalculator />
    </div>
  </div>

</template>

<script>
import RewardsCalculator from '../components/rewards_calculator/RewardsCalculator.vue';
import AssetsBlock from '../components/assets_block/AssetsBlock.vue';

export default {
	name: 'Home',
    path: '/',
	props: {
	},
    components: {
        RewardsCalculator,
        AssetsBlock,
    },
	data() {
		return {
            chain: 'sui:mainnet',
		}
	},
    watch: {
    },
	methods: {
        async switchTo(chainName) {
            this.chain = null;
            await new Promise((res)=>setTimeout(res, 500));
            this.chain = chainName;
        }
	},
    computed: {
    },
    beforeMount() {
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    h6 {
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 16px 0;
    }

    h5 {
        margin: 0 0 16px 0;
    }

    .active_one {
        font-weight: bold;
    }


</style>

