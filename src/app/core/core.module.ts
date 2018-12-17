import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppStateStore } from './state/app-state-store';
import { ProfitService } from './services/profit.service';
import { REPO_URL, RepoService } from './services/repo.service';
import { CommonAuxModule } from '../common-aux';
import { MessageService } from './services/message.service';
import { MessageErrorHandler } from './services/message-error-handler';
import { QuotesGuard } from './services/quotes.guard';
import { QuotesStorage } from './services/quotes-storage';
import { QUOTES_MIN_DATE, QuotesService } from './services/quotes.service';

@NgModule({
    imports: [
        HttpClientModule,
        CommonAuxModule
    ],
    providers: [
        AppStateStore,
        ProfitService,
        RepoService,
        MessageService,
        QuotesService,
        QuotesGuard,
        QuotesStorage,
        { provide: ErrorHandler, useClass: MessageErrorHandler },
        { provide: REPO_URL,  useValue: 'https://omsfeed.herokuapp.com/quotes' },
        { provide: QUOTES_MIN_DATE,  useValue: new Date('2018-06-01') }
    ]
})
export class CoreModule {
}
