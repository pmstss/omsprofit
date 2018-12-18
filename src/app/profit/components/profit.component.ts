import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faCaretDown, faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { ProfitMeta, ProfitService } from '../../quotes';
import { AutoUnsubscribe } from '../../common-aux';

@Component({
    selector: 'app-profit',
    templateUrl: './profit.component.html',
    styleUrls: ['./profit.component.css']
})
export class ProfitComponent implements OnInit {
    profitMeta: ProfitMeta = null;
    faCaretDown = faCaretDown;
    faCaretUp = faCaretUp;
    faCaretRight = faCaretRight;

    @AutoUnsubscribe private subscription: Subscription;

    constructor(private profitService: ProfitService) {
    }

    ngOnInit() {
        this.subscription = this.profitService.getProfitObservable().subscribe((profitMeta: ProfitMeta) => {
            this.profitMeta = profitMeta;
        });
    }
}
