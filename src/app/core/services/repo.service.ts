import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, concatAll, delay, map, mergeMap, timeout, toArray } from 'rxjs/operators';
import { AssetQuote } from '../types/asset-quote';

export const REPO_URL = new InjectionToken('repo_url');

@Injectable({
    providedIn: 'root'
})
export class RepoService {
    private DATE_FORMAT = 'yyyy-MM-dd';

    constructor(private http: HttpClient, @Inject(REPO_URL) private baseUrl: string) {
    }

    private static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            return throwError(`Network error:${error.error.message}`);
        }

        return throwError(`Network error ${error.status}: ${error.error}`);
    }

    private dateToString(date: Date): string {
        return formatDate(date, this.DATE_FORMAT, 'en');
    }

    private static preprocessQuote(quote: AssetQuote): AssetQuote {
        return AssetQuote.deserialize(quote);
    }

    getQuotesForRange(startDate: Date, endDate: Date): Observable<AssetQuote[]> {
        const queryParams =
            `?startDate=${this.dateToString(startDate)}&endDate=${this.dateToString(endDate)}`;
        return this.http.get<AssetQuote[]>(`${this.baseUrl}${queryParams}`).pipe(
            mergeMap(item => item),
            map(RepoService.preprocessQuote),
            toArray(),
            catchError(RepoService.handleError)
        );
    }

    getQuotesForDate(date: Date): Observable<AssetQuote[]> {
        return this.http.get<AssetQuote[]>(`${this.baseUrl}?date=${this.dateToString(date)}`).pipe(
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
