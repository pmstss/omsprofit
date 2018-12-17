import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { QuotesService } from './quotes.service';

@Injectable()
export class QuotesGuard implements CanActivate {
    constructor(private quotesService: QuotesService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.quotesService.getQuotesReadyPromise();
    }
}
