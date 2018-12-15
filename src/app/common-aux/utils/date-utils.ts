import { formatDate } from '@angular/common';

export interface DateUtils {
    isSameDate(d1: Date, d2: Date): boolean;
    isEarlier(dateFrom: Date, dateTo: Date): boolean;
    rangeAsArray(dateFrom: Date, dateTo: Date): Date[];
}

export class DateUtilsImpl implements DateUtils {
    isSameDate(d1: Date, d2: Date): boolean {
        return formatDate(d1, 'yyyy-MM-dd', 'en') === formatDate(d2, 'yyyy-MM-dd', 'en');
    }

    isEarlier(dateFrom: Date, dateTo: Date): boolean {
        return dateFrom.getTime() < dateTo.getTime();
    }

    rangeAsArray(dateFrom: Date, dateTo: Date): Date[] {
        const d = new Date(dateFrom);
        const dates: Date[] = [];
        while (d.getTime() < dateTo.getTime()) {
            dates.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return dates;
    }
}
