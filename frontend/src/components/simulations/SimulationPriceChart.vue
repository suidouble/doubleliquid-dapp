<template>

        <div style="">
        <ApexChartsAsync
            type="line"
            :options="chartOptions"
            :series="series" />
        </div>

</template>

<script>

import ApexChartsAsync from 'shared/components/AsyncComponents/ApexChartsAsync.js';
import { getCssVar } from 'quasar';

export default {
	name: 'SimulationPriceChart',
	props: {
		simulation1: Object,
        epoch: {
            type: Number,
            default: -1,
        },
	},
	data() {
		return {
            selectedEpoch: -1,
            series: [
                {
                    name: "Price of last transaction",
                    type: 'line',
                    data: [],
                },
                {
                    name: "Token Supply",
                    type: 'line',
                    data: [],
                },
                {
                    name: "Price calculated",
                    type: 'line',
                    data: [],
                },
            ],
            categories: [],
            annotationX: -1,
            annotationText: '',
		}
	},
	computed: {
		chartOptions() {
			return {
				categories: this.categories,
				chart: {
					id: "vuechart-example",
					toolbar: {
						show: false,
					},
					// height: 200,
				},stroke: {
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
				annotations: {
  xaxis: [
    {
        show: (!!this.annotationText),
      x: this.annotationX,
    fillColor: getCssVar('primary'),
      borderColor: getCssVar('primary'),
      color: getCssVar('primary'),
      label: {
        orientation: 'horizontal',
        style: {
          color: getCssVar('primary'),
            background: "#00E396"
        },
      borderColor: getCssVar('primary'),
      color: getCssVar('primary'),
        text: this.annotationText,
      }
    }
  ]
},
				colors: [getCssVar('primary'),getCssVar('secondary')],
				tooltip: {
					// fillSeriesColor: true,
                    x: {
                        show: false,
                        // formatter: function() {
                        //     return 'epoch';
                        // }
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
				},{
                    title: {text: 'Token Supply', style: { cssClass: 'apexcharts-yaxis-label',}},
					show: true,
                    opposite: true,
                    labels: {
                        style: {
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    formatter: function (value) {
                        return parseFloat(value, 10).toFixed(6) + "";
                    }
                    },
				},
                ],
				xaxis: {
                    type: 'category',
					categories: this.categories,
                    show: false,
                        hideOverlappingLabels: true,
                    labels: {
                    show: false,
                        rotate: -90,
                        hideOverlappingLabels: true,
                    style: {
                        fontSize: '15px',
                    },
                        formatter: function(v) {
                            return ''+v;
                        }
                    },
					// labels: {
					// 	style: {
					// 		cssClass: 'apexcharts-xaxis-label',
					// 	},
					// },
				},
			};
		},
	},
	components: {
		ApexChartsAsync,
	},
	watch:{
        simulation1: function() {
            if (this.simulation1) {
                this.updateChart();
            } else {
                this.epochRows = [];
                this.transactionsRows = [];
            }
        },
        epoch: function() {
            this.selectedEpoch = this.epoch;
            this.updateAnnotation();
        }
	},
	mounted() {
        if (this.simulation1) {
            this.updateChart();
        }
	},
	methods: {
        updateAnnotation() {
            let useEpoch = this.selectedEpoch;
            // if (useEpoch < 0) {
            //     // select the most recent available
            //     useEpoch = this.simulation1.epochs[this.simulation1.epochs.length - 1].epoch;
            // }

            let bestDistance = Infinity;
            let bestEpoch = null;
            let bestI = null;

            for (let i = 0; i < this.simulation1.epochs.length; i++) {
                const epoch = this.simulation1.epochs[i];
                let distance = Math.abs( parseInt(epoch.epoch, 10) - parseInt(useEpoch, 10) );
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestEpoch = epoch;
                    bestI = i;
                }
            }

            if (bestI == 0 || bestI == this.simulation1.epochs.length - 1) {
                bestEpoch = null;
            }

            if (bestEpoch && bestEpoch.epoch) {
                this.annotationText = "Price: "+bestEpoch.price_calculated.toFixed(3);
                this.annotationX = ''+bestEpoch.epoch;
            } else {
                this.annotationX = -1;
                this.annotationText = '';
            }
        },
        updateChart() {
            this.series[0].data = [];
            this.series[1].data = [];
            this.categories = [];

            for (const epoch of this.simulation1.epochs) {
                this.series[0].data.push({x: ''+epoch.epoch, y: epoch.price_calculated});
                this.series[1].data.push({x: ''+epoch.epoch, y: parseFloat(epoch.token_total_supply, 10)});
                // this.series[1].data.push(parseFloat(epoch.token_total_supply, 10));
                this.categories.push(epoch.epoch);
            }

            console.error('categories', this.categories);

			// const categories = [];
			// for (let stat of stats.stats) {
			// 	const statDate = new Date(stat.date);

			// 	serie.data.push(stat.count);
			// 	categories.push(''+statDate.toLocaleString('default', { month: 'short' })+' '+statDate.getDate());
			// }

			// this.calculated.series = [serie];
			// this.calculated.categories = categories;
        }
	},
	beforeCreate() {
	}
}
</script>

<style >


.apexcharts-tooltip {
		/*background: #f3f3f3;*/
		color: black;
	}
	.apexcharts-xaxis-label {
		fill: var(--text-color);
	}
	body.body--dark .apexcharts-xaxis-label {
		fill: var(--text-color-dark);
	}
	.apexcharts-yaxis-label {
		fill: var(--text-color);
	}
	body.body--dark .apexcharts-yaxis-label {
		fill: var(--text-color-dark);
	}

</style>