import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AppState, AppStateStore, AssetFilter, DatePeriod } from '../../core';
import { AutoUnsubscribe } from '../../common-aux';

@Component({
    selector: 'app-details-page',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
    datePeriodString: string;
    assetFilters: AssetFilter[];

    @AutoUnsubscribe private subscription: Subscription;

    constructor(private appStateStore: AppStateStore) {
    }

    ngOnInit() {
        this.subscription = this.appStateStore.state$.pipe(distinctUntilChanged()).subscribe((state: AppState) => {
            this.datePeriodString = state.datePeriod.toString();
            this.assetFilters = state.assetFilters
                .filter(assetFilter => state.investments.find(inv => inv.asset === assetFilter.asset))
                .map(assetFilter => AssetFilter.deserialize(assetFilter));
        });
    }

    onDateRangeChange() {
        this.appStateStore.updateDateRange(<DatePeriod>this.datePeriodString);
    }

    onAssetFiltersChange() {
        this.appStateStore.updateAssetFilters(this.appStateStore.state.assetFilters.map((assetFilter) => {
            const activeFilter = this.assetFilters.find(filter => filter.asset === assetFilter.asset);
            return activeFilter ? AssetFilter.deserialize(activeFilter) : assetFilter;
        }));
    }
}
