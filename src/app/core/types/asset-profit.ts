import { Investment } from './investment';
import { Asset } from './asset';

export class AssetProfit {
    investment: Investment;
    quote: number;

    constructor(investment: Investment, quote: number) {
        this.investment = investment;
        this.quote = quote;
    }

    get asset(): Asset {
        return this.investment.asset;
    }

    get value(): number {
        return this.quote * this.investment.amount;
    }

    get investValue(): number {
        return this.investment.value;
    }

    get profit(): number {
        return this.value - this.investValue;
    }

    get profitPercent(): number {
        return this.quote / this.investment.quote - 1;
    }

    get positive(): boolean {
        return this.profit > 0;
    }
}
