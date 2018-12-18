import { formatDate } from '@angular/common';
import { Asset } from './asset';

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
            date: formatDate(this.date, 'yyyy-MM-dd', 'en'),
            asset: this.asset,
            amount: this.amount,
            quote: this.quote
        };
    }

    clone(): Investment {
        return new Investment(this.serialize());
    }

    get value(): number {
        return this.amount * this.quote;
    }
}
