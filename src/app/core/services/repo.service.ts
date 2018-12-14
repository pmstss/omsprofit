import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, concatAll, delay, map, mergeMap, timeout, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { AssetQuote } from '../types/asset-quote';

export const REPO_URL = new InjectionToken('repo_url');

@Injectable({
    providedIn: 'root'
})
export class RepoService {
    private DATE_FORMAT = 'YYYY-MM-DD';

    constructor(private http: HttpClient, @Inject(REPO_URL) private baseUrl: string) {
    }

    private static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            return throwError(`Network error:${error.error.message}`);
        }

        return throwError(`Network error ${error.status}: ${error.error}`);
    }

    private formatDate(date: Date): string {
        return moment(date).format(this.DATE_FORMAT);
    }

    private static preprocessQuote(quote: AssetQuote): AssetQuote {
        return AssetQuote.deserialize(quote);
    }

    getQuotesForRange(startDate: Date, endDate: Date): Observable<AssetQuote[]> {
        const queryParams =
            `?startDate=${this.formatDate(startDate)}&endDate=${this.formatDate(endDate)}`;
        return this.http.get<AssetQuote[]>(`${this.baseUrl}${queryParams}`).pipe(
            mergeMap(item => item),
            map(RepoService.preprocessQuote),
            toArray(),
            catchError(RepoService.handleError)
        );
    }

    getQuotesForDate(date: Date): Observable<AssetQuote[]> {
        return this.http.get<AssetQuote[]>(`${this.baseUrl}?date=${this.formatDate(date)}`).pipe(
            mergeMap(item => item),
            map(RepoService.preprocessQuote),
            toArray(),
            catchError(RepoService.handleError),
            delay(5000)
        );
    }

    getQuotesForDates(dates: Date[]): Observable<AssetQuote[]> {
        return forkJoin(dates.map(d => this.getQuotesForDate(d))).pipe(
            concatAll(),
            mergeMap(item => item),
            map(RepoService.preprocessQuote),
            toArray()
        );
    }
}
