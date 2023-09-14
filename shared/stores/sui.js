import { defineStore } from 'pinia';
// const LiquidDouble = require('../classes/LiquidDouble.js');
import LiquidDouble from '../classes/LiquidDouble.js';

export const useSuiStore = defineStore('sui', {
	// convert to a function
	state: () => ({
		address: null,
        connectedChain: null,
        suiMaster: null,
		doubleLiquid: null,

		amount_sui: 0,
		amount_sui_string: '-1',
		amount_sui_loading: true,
		amount_sui_time: null,
		amount_sui_timeout: 10000,

		amount_isui: 0,
		amount_isui_string: '-1',
		amount_isui_loading: true,
		amount_isui_time: null,
		amount_isui_timeout: 10000,

		current_price: 0,
		current_price_loading: true,
		current_price_time: null,
		current_price_timeout: 10000,

		prices: [],
		apy: -1,
		rateGrowthPer1d: 1,

		promises: [],
		promises_total_amount: 0,
		promises_total_amount_string: '-1',

		current_epoch: 0,
		epoch_duration: 0,
		current_epoch_started_at: 0,
	}),
	getters: {
		connectionId: function(){ // using this to watch
			return ''+this.address+'_'+this.connectedChain;
		},
	},
	actions: {
		async getPromises() {
			if (this.doubleLiquid) {
				const promises = await this.doubleLiquid.getCurrentWithdrawPromises();
				this.promises = promises;

				let amount = 0;
				for (const promise of promises) {
					amount += Number(promise.fields.sui_amount);
				}

				this.promises_total_amount = Number(amount);
				this.promises_total_amount_string = await this.amountToString(amount);
			} else {
				this.promises = [];
			}
		},
		request() {
			console.log('connection requested');
		},
		setSuiMaster(suiMaster, settings = {}) {
			this.suiMaster = suiMaster;
            if (suiMaster.address) {
                this.address = suiMaster.address;
            } else {
                this.address = null;
            }
            if (suiMaster.connectedChain) {
				this.doubleLiquid = new LiquidDouble({
					suiMaster: suiMaster,
					packageId: settings.packageId,
					firstVPackageId: settings.firstVPackageId,
					liquidStoreId: settings.liquidStoreId,
					liquidStatsId: settings.liquidStatsId,
				});
				this.getCurrentPrice();
				if (suiMaster.connectedChain != this.connectedChain) {
					this.connectedChain = suiMaster.connectedChain;
					this.getRecentPrices();
				}
            } else {
                this.connectedChain = null;
				this.doubleLiquid = null;
            }
		},
		async getRecentPrices() {
			if (this.doubleLiquid) {
				const prices = await this.doubleLiquid.getRecentPrices();
				this.prices = prices;

				let averateGrowth = 0;
				let averateGrowthCount = 0;

				prices.forEach((p)=>{
					if (averateGrowthCount < 7) {
						if (p.growth > 1) { // ignore first few epochs
							averateGrowth = averateGrowth + p.growth;
							averateGrowthCount++;
						}
					}
				});

				if (averateGrowthCount > 0) {
					averateGrowth = averateGrowth / averateGrowthCount;
				}
				if (averateGrowth < 1.000114) {
					averateGrowth = 1.000114;
				}



				// console.log(prices);
				this.rateGrowthPer1d = averateGrowth;

				const inAYear = Math.pow(averateGrowth, 365);
				this.apy = (inAYear * 100) - 100;
				// this.averateGrowth
				// console.log(apy);

				// await this.getCurrentPrice();
			}
		},
		async refreshBalances() {
			this.amount_sui = -1;
			this.amount_sui_time = null;
			this.amount_sui_string = '-1';


			this.amount_isui = -1;
			this.amount_isui_time = null;
			this.amount_isui_string = '-1';


			this.promises_total_amount = -1;
			this.promises_total_amount_string = -1;
			this.promises = [];

			await new Promise((res)=>setTimeout(res, 300));
			await this.getSuiBalance();
			await new Promise((res)=>setTimeout(res, 300));
			await this.getTokenBalance();
			await new Promise((res)=>setTimeout(res, 300));
			await this.getPromises();
			await new Promise((res)=>setTimeout(res, 300));
			await this.getCurrentSystemState();
		},
		async getSuiBalance() {
			if (this.amount_sui_time) {
				const now = (new Date()).getTime();
				if ((now - this.amount_sui_time) < this.amount_sui_timeout) {
					return this.amount_sui;
				}
			}

			this.amount_sui_loading = true;
			try {
				const balance = await this.doubleLiquid.getCurrentSUIBalance();
				this.amount_sui = balance;
				this.amount_sui_string = await this.amountToString(this.amount_sui);

				// alert(balance);
			} catch(e) {
				console.error(e);
			}
			this.amount_sui_loading = false;
			this.amount_sui_time = (new Date()).getTime();

			return this.amount_sui;
		},
		async getTokenBalance() {
			if (this.amount_isui_time) {
				const now = (new Date()).getTime();
				if ((now - this.amount_isui_time) < this.amount_isui_timeout) {
					return this.amount_isui;
				}
			}

			this.amount_isui_loading = true;
			try {
				const balance = await this.doubleLiquid.getCurrentTokenBalance();

				this.amount_isui = balance;
				this.amount_isui_string = await this.amountToString(this.amount_isui);

			} catch(e) {
				console.error(e);
			}
			this.amount_isui_loading = false;
			this.amount_isui_time = (new Date()).getTime();

			await this.doubleLiquid.getCurrentEpoch();

			return this.amount_isui;
		},
		async getCurrentPrice() {
			if (this.current_price_time) {
				const now = (new Date()).getTime();
				if ((now - this.current_price_time) < this.current_price_timeout) {
					return this.current_price;
				}
			}

			this.current_price_loading = true;
			try {

				this.current_price = await this.doubleLiquid.getCurrentPrice();

			} catch(e) {
				console.error(e);
			}
			this.current_price_loading = false;
			this.current_price_time = (new Date()).getTime();

			return this.current_price;
		},
		async getCurrentSystemState() {
			try {
				const state = await this.doubleLiquid.getCurrentSystemState();
				this.current_epoch = parseInt(state.epoch);
				this.epoch_duration = parseInt(state.epochDurationMs);
				const date = new Date();
				date.setTime(parseInt(state.epochStartTimestampMs, 10));
				this.current_epoch_started_at = date;

				// alert(this.epoch_duration)
			} catch (e) {
				console.error(e);
			}
		},
		async amountToString(amount) {
			const suiCoin = this.suiMaster.suiCoins.get('sui');
			await suiCoin.getMetadata();

			return suiCoin.amountToString(amount);
		}
	},
});