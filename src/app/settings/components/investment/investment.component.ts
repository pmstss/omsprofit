import { Component, EventEmitter, Inject, Input, KeyValueDiffer, KeyValueDiffers,
    OnInit, Output, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgForm } from '@angular/forms';
import { Asset, AssetQuote, Investment, QuotesService, QUOTES_MIN_DATE } from '../../../core';
import { DateUtilsToken, DateUtils, DialogService } from '../../../common-aux';

@Component({
    selector: 'investment',
    templateUrl: './investment.component.html',
    styleUrls: ['./investment.component.css'],
    animations: [
        trigger('fadeAnimation', [
            state('in', style({ opacity: 1 })),

            transition('void => *', [
                style({ opacity: 0 }),
                animate(700)
            ]),

            transition('* => void', [
                animate(700, style({ opacity: 0 }))
            ])
        ])
    ]
})
export class InvestmentComponent implements OnInit {
    @Input('investment') inv: Investment;
    @Input('idx') idx: number;
    @Input('total') total: number;
    @ViewChild('form') public form: NgForm;
    @Output() removed = new EventEmitter<void>();

    private static DATE_INPUT_FORMAT = 'yyyy-MM-dd';

    minDateString: string;
    maxDateString: string;
    dateModel: string;
    loadingQuote: boolean;

    differ: KeyValueDiffer<string, any>;

    constructor(private quotesService: QuotesService, private dialogService: DialogService,
                @Inject(DateUtilsToken) private dateUtils: DateUtils,
                @Inject(QUOTES_MIN_DATE) minDate: Date,
                private keyValueDiffers: KeyValueDiffers) {
        this.minDateString = InvestmentComponent.formatDateForInput(minDate);
        this.maxDateString = InvestmentComponent.formatDateForInput(new Date());
    }

    private static formatDateForInput(d: Date): string {
        return formatDate(d, InvestmentComponent.DATE_INPUT_FORMAT, 'en');
    }

    ngOnInit() {
        this.dateModel = InvestmentComponent.formatDateForInput(this.inv.date);

        this.differ = this.keyValueDiffers.find(this.inv.serialize()).create();
    }

    ngDoCheck() {
        const diff = this.differ.diff(this.inv.serialize());
        if (diff) {
            const changedKeys = [];
            diff.forEachChangedItem(changeRecord => changedKeys.push(changeRecord.key));

            // Reset quote on asset/date change
            if (changedKeys.length === 1 && (changedKeys[0] === 'asset' || changedKeys[0] === 'date')) {
                this.inv.quote = 0;
            }

            // Marking controls as dirty after external changes, e. g. after fetching quote
            changedKeys.forEach(key => this.form.controls[key].markAsDirty());
        }
    }

    fetchQuote(inv: Investment) {
        this.loadingQuote = true;
        this.quotesService.getQuote(inv.date, inv.asset).then((quote: AssetQuote) => {
            inv.quote = quote.sellUsd;
            this.loadingQuote = false;
        }).catch(() => this.loadingQuote = false);
    }

    removeInvestment() {
        this.dialogService.confirm('Are you sure to remove investment?').then((confirmed) => {
            if (confirmed) {
                this.removed.emit();
            }
        });
    }

    onDateChange(e: any) {
        const value = e.target.value;
        if (!value) {
            return;
        }

        const date = new Date(value);
        if (this.form.controls['date'].valid) {
            this.inv.date = date;
        }
    }

    getAssetMaxAmount(asset: Asset) {
        return asset === 'ag' ? 50000 : 1000;
    }

    get dirty() {
        return this.form && this.form.dirty;
    }

    get valid() {
        return this.form && this.form.valid;
    }
}
