import { Inject, Injectable, InjectionToken } from '@angular/core';
import { formatDate } from '@angular/common';
import { Asset } from '../../core';
import { DateUtils, DateUtilsToken } from '../../common-aux';
import { RepoService } from './repo.service';
import { QuotesStorage } from './quotes-storage';
import { AssetQuote } from '../types/asset-quote';

export const QUOTES_MIN_DATE = new InjectionToken('QUOTES_MIN_DATE');

@Injectable()
export class QuotesService {

    private quotesMapPromise:Promise<Map<string, AssetQuote>> = null;

    constructor(private quotesStorage: QuotesStorage, private repoService: RepoService,
                @Inject(QUOTES_MIN_DATE) private minDate: Date,
                @Inject(DateUtilsToken) private dateUtils: DateUtils) {
    }

    private static key(quote: {asset: Asset, date: Date}): string {
        return quote.asset + formatDate(quote.date, 'yyyy-MM-dd', 'en');
    }

    private findFirstMissingDate(quotes: AssetQuote[]): Date {
        if (quotes.length) {
            const date = new Date(quotes[quotes.length - 1].date);
            date.setDate(date.getDate() + 1);
            return date;
        }

        return this.minDate;
    }

    fetchLatest(): Promise<AssetQuote[]> {
        return this.quotesStorage.loadQuotes()
            .then((quotes) => {
                const firstMissingDate = this.findFirstMissingDate(quotes);
                return this.dateUtils.isEarlier(new Date(), firstMissingDate)
                    ? quotes
                    : this.repoService.getQuotes(firstMissingDate, new Date()).toPromise()
                        .then(quotes => this.quotesStorage.addQuotes(quotes));
            });
    }

    getQuote(date: Date, asset: Asset): Promise<AssetQuote> {
        return this.quotesMapPromise.then(quotesMap => quotesMap.get(QuotesService.key({ asset, date })));
    }

    getQuotesReadyPromise(): Promise<boolean> {
        if (!this.quotesMapPromise) {
            this.quotesMapPromise = this.fetchLatest().then(quotes =>
                quotes.reduce(
                    (quotesMap: Map<string, AssetQuote>, quote) => {
                        quotesMap.set(QuotesService.key(quote), quote);
                        return quotesMap;
                    },
                    new Map<string, AssetQuote>()
                )
            ).catch((e) => {
                console.error('stored quotes didn\'t pass sanity check, will clear and reload', e);
                return this.quotesStorage.clear().then(() => {
                    window.location.reload();
                    throw e;
                });
            });
        }
        return this.quotesMapPromise.then(() => true);
    }

    // private findNearestQuote(date: Date, inv: Investment, quotes: AssetQuote[]): AssetQuote {
    //     let currentQuote;
    //     for (let i = 0, d = new Date(date); i < 10 && !currentQuote; ++i, d.setDate(d.getDate() - 1)) {
    //         currentQuote = this.findAssetQuoteForDate(quotes, inv.asset, d);
    //     }
    //     return currentQuote;
    // }

}
