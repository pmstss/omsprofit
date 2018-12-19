import { AssetProfit } from './asset-profit';

export class ProfitMeta {
    assetsProfit: AssetProfit[] = [];
    date: Date;

    constructor(date) {
        this.date = date;
    }

    get investValue(): number {
        return this.assetsProfit.reduce((res, assetProfit) => res + assetProfit.investValue, 0);
    }

    get value(): number {
        return this.assetsProfit.reduce((res, p) => res + p.value, 0);
    }

    get profit(): number {
        return this.assetsProfit.length ? this.value - this.investValue : undefined;
    }

    get profitPercent(): number {
        return this.assetsProfit.length ? this.value / this.investValue - 1 : undefined;
    }

    get positive(): boolean {
        return this.profitPercent > 0;
    }

    get today(): boolean {
        return this.date.toISOString().substr(0, 10) === (new Date()).toISOString().substr(0, 10);
    }
}
