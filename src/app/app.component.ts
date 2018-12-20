import { Component, OnInit } from '@angular/core';
import { MessageService, MessageType } from './core';
import { QuotesService } from './quotes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    quotesPromise: Promise<boolean> = null;

    constructor(private quotesService: QuotesService, private messageService: MessageService) {
    }

    ngOnInit() {
        this.quotesPromise = this.quotesService.getQuotesReadyPromise().catch((err) => {
            this.messageService.publish({
                message: `${err}\nPlease, try to reload later.`,
                type: MessageType.ERROR
            });
        }).then(() => true);
    }
}
