import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faCaretDown, faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { ProfitMeta, ProfitService } from '../../quotes';
import { AutoUnsubscribe } from '../../common-aux';
import { MessageService, MessageType } from 'src/app/core';

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

    constructor(private profitService: ProfitService, private messageService: MessageService) {
    }

    ngOnInit() {
        this.subscription = this.profitService.getProfitObservable().subscribe(
            (profitMeta: ProfitMeta) => {
                this.profitMeta = profitMeta;
            },
            e => this.messageService.publish({
                message: e,
                type: MessageType.ERROR
            })
        );
    }
}
