import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { AppStateStore, Investment } from '../../core';
import { DateUtilsToken, DateUtils } from '../../common-aux';
import { AssetProfit } from '../types/asset-profit';
import { ProfitMeta } from '../types/profit-meta';
import { QuotesService } from './quotes.service';

export class ProfitAppState {
    investments: Investment[];
}

@Injectable()
export class ProfitService {
    constructor(private appStateStore: AppStateStore, private quotesService: QuotesService,
                @Inject(DateUtilsToken) private dateUtils: DateUtils) {
    }

    calculateProfitFor(date: Date, investments: Investment[]): Promise<ProfitMeta> {
        return investments.reduce(
            async (profitMetaPromise: Promise<ProfitMeta>, inv: Investment): Promise<ProfitMeta> => {
                const profitMeta = await profitMetaPromise;

                if (this.dateUtils.isEarlier(date, inv.date)) {
                    return profitMeta;
                }

                const quote = await this.quotesService.getQuote(date, inv.asset);
                if (quote) {
                    profitMeta.assetsProfit.push(new AssetProfit(inv, quote.buyUsd));
                }

                return profitMeta;
            },
            Promise.resolve(new ProfitMeta())
        );
    }

    getProfitObservable(): Observable<ProfitMeta> {
        return this.appStateStore.state$.pipe(
            map(appState => ({ investments: appState.investments })),
            distinctUntilChanged(),
            flatMap((appState: ProfitAppState) => {
                return this.calculateProfitFor(new Date(), appState.investments);
            })
        );
    }
}
