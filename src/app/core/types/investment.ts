import { Asset } from './asset';
import { MomentDateUtils } from '../../common-aux';

export interface InvestmentData {
    date: string;
    asset: Asset;
    amount: number;
    quote: number;
}

export class Investment {
    date: Date;
    asset: Asset;
    amount: number;
    quote: number;

    private dateUtils = new MomentDateUtils();

    constructor(data?: InvestmentData) {
        this.date = data ? new Date(data.date) : new Date();
        this.asset = data ? data.asset : null;
        this.amount = data ? data.amount : 0;
        this.quote = data ? data.quote : 0;
    }

    static deserialize(data: InvestmentData): Investment {
        return new Investment(data);
    }

    serialize(): InvestmentData {
        return {
            date: this.dateUtils.format(this.date, 'YYYY-MM-DD'),
            asset: this.asset,
            amount: this.amount,
            quote: this.quote
        };
    }

    clone(): Investment {
        return new Investment(this.serialize());
    }

    equals(data: InvestmentData): boolean {
        return data && this.asset === data.asset && this.amount === data.amount && this.quote === data.quote &&
                this.dateUtils.isSameDate(this.date, data.date);
    }

    get value(): number {
        return this.amount * this.quote;
    }
}
