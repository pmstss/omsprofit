import { Injectable } from '@angular/core';
import { Store } from 'rxjs-observable-store';
import { AppStateIo } from './app-state-io';
import { AppState, DEFAULT_INVESTMENTS } from './app-state';
import { AssetFilter } from '../types/asset-filter';
import { DatePeriod } from '../types/date-period';
import { Investment } from '../types/investment';

@Injectable({
    providedIn: 'root'
})
export class AppStateStore extends Store<AppState> {
    constructor() {
        super(AppStateIo.loadAppState());

        this.state$.subscribe((appState) => {
            AppStateIo.saveAppState(appState);
        });
    }

    updateDateRange(dateRange: DatePeriod): void {
        this.setState({
            ...this.state,
            datePeriod: dateRange
        });
    }

    updateAssetFilters(assetFilters: AssetFilter[]): void {
        this.setState({
            ...this.state,
            assetFilters
        });
    }

    updateInvestments(investments: Investment[]): void {
        this.setState({
            ...this.state,
            investments
        });
    }

    resetInvestments(): void {
        this.setState({
            ...this.state,
            investments: [...DEFAULT_INVESTMENTS]
        });
    }
}
