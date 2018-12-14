import { Investment } from '../types/investment';
import { DatePeriod } from '../types/date-period';
import { AssetFilter } from '../types/asset-filter';

export const DEFAULT_INVESTMENTS: Investment[] = [
    new Investment({ date: '2018-07-20', asset: 'pt', amount: 61, quote: 27.15 }),
    new Investment({ date: '2018-07-20', asset: 'au', amount: 37, quote: 40.41 }),
    new Investment({ date: '2018-07-20', asset: 'pd', amount: 31, quote: 29.05 })
];

export class AppState {
    datePeriod = DatePeriod.LAST_MONTH;
    assetFilters: AssetFilter[] = [
        new AssetFilter({ asset: null, enabled: true }),
        new AssetFilter({ asset: 'au', enabled: true }),
        new AssetFilter({ asset: 'pt', enabled: true }),
        new AssetFilter({ asset: 'ag', enabled: true }),
        new AssetFilter({ asset: 'pd', enabled: true })
    ];
    investments = [...DEFAULT_INVESTMENTS];
}
