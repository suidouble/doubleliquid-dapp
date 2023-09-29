<template>

    <q-icon name="bar_chart" class="text-primary cursor-pointer price_chart_icon">
        <q-popup-proxy transition-show="flip-up" transition-hide="flip-down" @show="onShown" @before-show="onBeforeShow">
        <q-banner class="bg-primary text-white price_chart_icon_inner">

            <div class="relative-position" style="height: 350px; overflow: hidden;">
                <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                >
                <ApexChartsAsync v-show="!isLoading" :options="chartOptions" :series="series" height="350px"/>
                </transition>

                <q-inner-loading :showing="isLoading">
                    <q-spinner-gears size="50px" color="white" />
                </q-inner-loading>
            </div>

        </q-banner>
        </q-popup-proxy>
    </q-icon>

</template>

<style lang="css" scoped="scoped">
    .price_chart_icon_inner .q-inner-loading {
        background: transparent !important;
    }
    .price_chart_icon_inner .apexcharts-yaxis-label {
        color: white;
        fill: #fff !important;
    }
    .price_chart_icon_inner {
        width: 30vw;
        overflow: hidden;
    }

    @media (max-width: 1200px) {
        .price_chart_icon_inner {
            width: 50vw;
        }

    }
    @media (max-width: 700px) {
        .price_chart_icon_inner {
            width: 90vw;
        }

    }
</style>

<script>
import ApexChartsAsync from 'shared/components/AsyncComponents/ApexChartsAsync.js';

export default {
	name: 'PriceChartIcon',
	props: {
	},
	data() {
		return {
			isLoading: true,
            categories: [],
            series: [
                {
                    name: "Price",
                    type: 'line',
                    data: [],
                }],
		}
	},
    emits: [],
	watch: {
	},
	computed: {
		chartOptions() {
			return {
				categories: this.categories,
				chart: {
					id: "vuechart-example33",
					toolbar: {
						show: false,
					},
				},
                stroke: {
                    curve: 'smooth',
                },
                legend: {
                    show: false,
                },
				grid: {
					padding: {
						left: 8,
						right: 0,
					},
				},
				colors: ['#ffffff'],
				tooltip: {
                    x: {
                        show: false,
                    }
				},
				yaxis: [{
                    title: {text: 'Price', style: { cssClass: 'apexcharts-yaxis-label',}},
					show: true,
                    labels: {
                        style: {
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    formatter: function (value) {
                        return parseFloat(value, 10).toFixed(6) + "";
                    }
                    },
				}],
				xaxis: {
                    title: {text: 'Epoch', style: { cssClass: 'apexcharts-yaxis-label',}},
                    type: 'category',
					categories: this.categories,
                    show: true,
                },
			};
		},
	},
	components: {
        ApexChartsAsync,
	},
	methods: {
        onBeforeShow() {
            this.isLoading = true;
        },
        async onShown() {
            this.isLoading = true;

            await new Promise((res)=>setTimeout(res, 50));

            this.categories = [];
            this.series[0].data = [];
            if (this.$store.sui && this.$store.sui.prices) {
                for (let i = (this.$store.sui.prices.length - 1); i>=0; i--) {
                    if (this.categories.length < 9) {
                        const price = this.$store.sui.prices[i];
                        this.categories.push(price.epoch);
                        this.series[0].data.push(price.priceAsFloat);
                    }
                }
            }

            this.isLoading = false;
        },
	},
	beforeMount: function() {
	},
	mounted: async function() {
	},
    unmounted: function() {
    },
}
</script>
