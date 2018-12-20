import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { QuotesService } from '../services/quotes.service';

@Injectable()
export class QuotesGuard implements CanActivate {
    constructor(private quotesService: QuotesService) {
    }

    canActivate(): Promise<boolean> {
        return this.quotesService.getQuotesReadyPromise().then(() => true).catch(() => false);
    }
}
