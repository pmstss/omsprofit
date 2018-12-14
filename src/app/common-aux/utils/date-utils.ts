import * as moment from 'moment';

type DateType =  moment.Moment | Date | string;

export interface DateUtils {
    isSameDate(d1: DateType, d2: DateType): boolean;
    isBetween(date: DateType, dateFrom: DateType, dateTo: DateType): boolean;
    isEarlier(dateFrom: DateType, dateTo: DateType): boolean;
    rangeAsArray(dateFrom: DateType, dateTo: DateType): Date[];
    format(date: DateType, format: string): string;
}

export class MomentDateUtils implements DateUtils {
    isSameDate(d1: DateType, d2: DateType): boolean {
        return moment(d1).diff(d2, 'days') === 0;
    }

    isBetween(date: DateType, dateFrom: DateType, dateTo: DateType): boolean {
        return moment(date).isBetween(moment(dateFrom), moment(dateTo));
    }

    isEarlier(dateFrom: DateType, dateTo: DateType): boolean {
        return moment(dateFrom).diff(dateTo) < 0;
    }

    rangeAsArray(dateFrom: DateType, dateTo: DateType): Date[] {
        const m = moment(dateFrom);
        const dates: Date[] = [];
        while (m.diff(dateTo, 'hours') <= 0) {
            dates.push(m.toDate());
            m.add(1, 'day');
        }
        return dates;
    }

    format(date: DateType, format: string): string {
        return moment(date).format(format);
    }
}
