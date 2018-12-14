import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, distinctUntilChanged, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DateUtilsToken, ArrayUtilsToken, DateUtils, ArrayUtils } from '../../common-aux';
import { Asset } from '../types/asset';
import { AssetQuote } from '../types/asset-quote';
import { AssetProfit } from '../types/asset-profit';
import { ProfitMeta } from '../types/profit-meta';
import { Investment } from '../types/investment';
import { RepoService } from './repo.service';
import { AppStateStore } from '../state/app-state-store';

export class ProfitAppState {
    investments: Investment[];
}

@Injectable()
export class ProfitService {
    constructor(private repoService: RepoService, private appStateStore: AppStateStore,
                @Inject(DateUtilsToken) private dateUtils: DateUtils,
                @Inject(ArrayUtilsToken) private arrayUtils: ArrayUtils) {
    }

    private findAssetQuoteForDate(quotes: AssetQuote[], asset: Asset, date: Date | moment.Moment): AssetQuote {
        return quotes.find(item => this.dateUtils.isSameDate(item.date, date) && item.asset === asset);
    }

    private findNearestQuote(date: Date, inv: Investment, quotes: AssetQuote[]): AssetQuote {
        let currentQuote;
        for (let i = 0, m = moment(date); i < 10 && !currentQuote; ++i, m.add(-1, 'd')) {
            currentQuote = this.findAssetQuoteForDate(quotes, inv.asset, m.toDate());
        }
        return currentQuote;
    }

    calculateProfitFor(date: Date, investments: Investment[], quotes: AssetQuote[]): ProfitMeta {
        return investments.reduce(
            (profitMeta: ProfitMeta, inv: Investment): ProfitMeta => {
                if (this.dateUtils.isEarlier(date, inv.date)) {
                    return profitMeta;
                }

                const currentQuote = this.findNearestQuote(date, inv, quotes);
                if (!currentQuote) {
                    console.error('### no quote found for date: %o and asset: %o', date, inv.asset);
                } else {
                    profitMeta.assetsProfit.push(new AssetProfit(inv, currentQuote.buyUsd));
                }

                return profitMeta;
            },
            new ProfitMeta()
        );
    }

    getProfitObservable(): Observable<ProfitMeta> {
        return this.appStateStore.state$.pipe(
            map(appState => ({ investments: appState.investments })),
            distinctUntilChanged(),
            concatMap((appState: ProfitAppState) => {
                const today = new Date();
                const dates = this.arrayUtils.unique([today, ...appState.investments.map(inv => new Date(inv.date))]);
                return this.repoService.getQuotesForDates(dates).pipe(
                    map((quotes: AssetQuote[]): ProfitMeta => {
                        return this.calculateProfitFor(today, appState.investments, quotes);
                    })
                );
            })
        );
    }
}
