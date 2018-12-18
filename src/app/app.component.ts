import { Component, OnInit } from '@angular/core';
import { QuotesService } from './quotes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    quotesPromise: Promise<boolean> = null;

    constructor(private quotesService: QuotesService) {
    }

    ngOnInit() {
        this.quotesPromise = this.quotesService.getQuotesReadyPromise();
    }
}
