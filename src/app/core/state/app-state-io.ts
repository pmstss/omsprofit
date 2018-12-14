import { AssetFilter, AssetFilterData } from '../types/asset-filter';
import { Investment, InvestmentData } from '../types/investment';
import { DatePeriod } from '../types/date-period';
import { AppState } from './app-state';

const STORAGE_KEY_STATE = 'appState';

interface SerializedAppState {
    datePeriod: string;
    assetFilters: AssetFilterData[];
    investments: InvestmentData[];
}

export class AppStateIo {
    static loadAppState(): AppState {
        const appState: AppState = new AppState();
        const storedStateStr = localStorage.getItem(STORAGE_KEY_STATE);
        if (storedStateStr) {
            try {
                const storedState: SerializedAppState = JSON.parse(storedStateStr);
                appState.investments = storedState.investments.map(x => Investment.deserialize(x));
                appState.assetFilters = storedState.assetFilters.map(x => AssetFilter.deserialize(x));
                // TODO ### DatePeriod[<keyof typeof DatePeriod>storedState.datePeriod]
                appState.datePeriod = <DatePeriod><any>storedState.datePeriod || DatePeriod.ALL_TIME;
            } catch (e) {
                console.error('invalid data in localStorage, defaults will be applied');
            }
        }

        return appState;
    }

    static saveAppState(appState: AppState): void {
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify({
            investments: appState.investments.map(inv => inv.serialize()),
            assetFilters: appState.assetFilters.map(assetFilter => assetFilter.serialize()),
            datePeriod: appState.datePeriod
        }));
    }
}
