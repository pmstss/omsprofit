import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { IChartistSeriesData, IChartistSettingsType } from 'ngx-chartist';
import * as moment from 'moment';
import { Asset, AssetQuote, AssetFilter, Investment, AppState, AppStateStore,
    DatePeriod, ProfitService, RepoService } from '../../../core';
import { DateUtilsToken, DateUtils, AutoUnsubscribe } from '../../../common-aux';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css'],
    encapsulation: ViewEncapsulation.Native
})
export class ChartComponent implements OnInit {
    @ViewChild('inner') inner: any;

    @AutoUnsubscribe private subscription: Subscription;

    chartOpts: IChartistSettingsType = {
        data: {
            labels: null,
            series: null
        },
        options: {
            fullWidth: true,
            axisX: {
                labelInterpolationFnc: (label, idx, labels) => {
                    const step = Math.max(Math.round(labels.length / 10), 1);
                    if (idx % step === 0) {
                        return moment(label).format('DD MMM');
                    }
                }
            },
            axisY: {
                scaleMinSpace: 10,
                onlyInteger: true
            }
        }
    };

    constructor(private appStateStore: AppStateStore, private repoService: RepoService,
                private profitService: ProfitService,
                @Inject(DateUtilsToken) private dateUtils: DateUtils) {
    }

    ngOnInit(): void {
        this.subscription = this.appStateStore.state$.pipe(
            map(state => ({
                datePeriod: state.datePeriod,
                assetFilters: state.assetFilters,
                investments: state.investments
            })),
            distinctUntilChanged()
        ).subscribe((state: AppState) => {
            const { dateTo, dateFrom } = ChartComponent.getFromToDatesByPeriod(state.datePeriod, state.investments);
            const dates: Date[] = this.dateUtils.rangeAsArray(dateFrom, dateTo);

            const invMinDate = moment(Math.min(...state.investments.map(inv => inv.date.getTime())));

            this.repoService.getQuotesForRange(dateFrom.toDate(), dateTo.toDate()).subscribe((quotes) => {
                this.chartOpts.data.series = [
                    this.generateSerie(null, dates, state, quotes),
                    ...state.investments
                        .filter(inv => state.assetFilters.find(x => x.asset === inv.asset).enabled)
                        .map(inv => this.generateSerie(inv, dates, state, quotes))
                ];
                this.chartOpts.data.labels = dates;

                if (this.inner) {
                    this.inner.chart.eventEmitter.emit('optionsChanged');
                }
            });
        });
    }

    private static getFromToDatesByPeriod(dateRange: DatePeriod, investments: Investment[]):
            {dateFrom: moment.Moment, dateTo: moment.Moment} {
        const dateTo = moment();

        let dateFrom = moment();
        if (dateRange === DatePeriod.LAST_WEEK) {
            dateFrom.add(-7, 'days');
        } else if (dateRange === DatePeriod.LAST_MONTH) {
            dateFrom.add(-1, 'month');
        } else if (dateRange === DatePeriod.ALL_TIME) {
            dateFrom = moment(Math.min(...investments.map(inv => inv.date.getTime())));
        }

        return { dateFrom, dateTo };
    }

    private generateSerie(inv: Investment, dates: Date[], state: AppState, quotes: AssetQuote[]): IChartistSeriesData {
        return {
            data: dates.map(
                date => this.profitService.calculateProfitFor(date, !inv ? state.investments : [inv], quotes).profit),
            className: `ct-series-${inv ? inv.asset : 'all'}`
        };
    }
}
