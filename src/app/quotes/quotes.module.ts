import { NgModule } from '@angular/core';
import { CoreModule } from '../core';
import { QuotesStorage } from './services/quotes-storage';
import { RepoService, REPO_URL } from './services/repo.service';
import { QuotesGuard } from './guards/quotes.guard';
import { ProfitService } from './services/profit.service';
import { QuotesService, QUOTES_MIN_DATE } from './services/quotes.service';

@NgModule({
    imports: [CoreModule],
    declarations: [],
    providers: [
        QuotesService,
        ProfitService,
        QuotesStorage,
        RepoService,
        QuotesGuard,
        { provide: REPO_URL,  useValue: 'https://omsfeed.herokuapp.com/quotes' },
        { provide: QUOTES_MIN_DATE,  useValue: new Date('2018-06-01') }
    ]
})
export class QuotesModule {
}
