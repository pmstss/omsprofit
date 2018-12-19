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
        return `${formatDate(quote.date, 'yyyy-MM-dd', 'en')} ${quote.asset}`;
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
                        .then(quotes => this.quotesStorage.addQuotes(quotes))
                        .catch((e) => {
                            console.error('quotes fetch error', e);
                            throw new Error('Network error on quotes fetch');
                        });
            });
    }

    getQuote(date: Date, asset: Asset): Promise<AssetQuote> {
        return this.quotesMapPromise.then(quotesMap => quotesMap.get(QuotesService.key({ asset, date })));
    }

    getQuotesReadyPromise(): Promise<boolean> {
        if (!this.quotesMapPromise) {
            this.quotesMapPromise = this.fetchLatest().then(quotes =>
                quotes.reduce(
                    (quotesMap, quote) => quotesMap.set(QuotesService.key(quote), quote),
                    new Map<string, AssetQuote>()
                )
            );
        }
        return this.quotesMapPromise.then(() => true);
    }

    getLatestAvailableDate(): Promise<Date> {
        return this.quotesMapPromise
            .then(quotesMap => Math.max(...[...quotesMap.values()].map(q => q.date.getTime())))
            .then(n => new Date(n));
    }
}
