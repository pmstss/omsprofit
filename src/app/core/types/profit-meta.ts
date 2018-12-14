import { AssetProfit } from './asset-profit';

export class ProfitMeta {
    assetsProfit: AssetProfit[] = [];

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
}
