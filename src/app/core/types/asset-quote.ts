import { AssetOperation } from './asset-operation';
import { Asset } from './asset';

class AssetQuoteNormalizer {
    private static EPS = 0.0003;

    constructor(private assetQuote: AssetQuote) {
    }

    private getDeltaForAsset(): number {
        return this.assetQuote.asset === 'au' ? 0.02 : this.assetQuote.asset === 'pd' ? 0.04 : 0.03;
    }

    private getNormalizedQuote(buyQuote: number, sellQuote: number, op: AssetOperation): number {
        const delta = this.getDeltaForAsset();
        if (buyQuote / sellQuote < 1 - delta - AssetQuoteNormalizer.EPS) {
            return (sellQuote + buyQuote) / 2 * (op === AssetOperation.Buy ? 1 - delta / 2 : 1 + delta / 2);
        }
        return op === AssetOperation.Buy ? buyQuote : sellQuote;
    }

    normalize() {
        const q = {
            ...this.assetQuote
        };
        return {
            sellByn: this.getNormalizedQuote(q.buyByn, q.sellByn, AssetOperation.Sell),
            buyByn: this.getNormalizedQuote(q.buyByn, q.sellByn, AssetOperation.Buy),
            sellUsd: this.getNormalizedQuote(q.buyUsd, q.sellUsd, AssetOperation.Sell),
            buyUsd: this.getNormalizedQuote(q.buyUsd, q.sellUsd, AssetOperation.Buy)
        };
    }
}

export class AssetQuote {
    date: Date;
    code: number;
    asset: Asset;
    sellByn: number;
    buyByn: number;
    sellUsd: number;
    buyUsd: number;

    constructor(assetQuote: AssetQuote, normalize: boolean) {
        this.date = assetQuote.date;
        this.code = assetQuote.code;
        this.asset = assetQuote.asset;

        if (normalize) {
            Object.assign(this, new AssetQuoteNormalizer(assetQuote).normalize());
        }
    }

    static deserialize(assetQuote: AssetQuote, normalize: boolean = true): AssetQuote {
        return new AssetQuote(
            {
                ...assetQuote,
                date: new Date(assetQuote.date)
            },
            normalize
        );
    }
}
