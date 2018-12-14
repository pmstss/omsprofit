import { Directive, Inject } from '@angular/core';
import {
    NG_VALIDATORS,
    FormControl,
    ValidatorFn,
    Validator, ValidationErrors
} from '@angular/forms';
import { QUOTES_MIN_DATE } from '../../../../core';
import { DateUtils, DateUtilsToken } from '../../../../common-aux';

@Directive({
    selector: '[dateValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: DateValidator,
            multi: true
        }
    ]
})
export class DateValidator implements Validator {
    validator: ValidatorFn;

    constructor(@Inject(DateUtilsToken) private dateUtils: DateUtils,
                @Inject(QUOTES_MIN_DATE) private minDate: Date) {
        this.validator = this.dateValidator();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    static validationError(message: string): ValidationErrors {
        return {
            custom: {
                message,
                valid: false
            }
        };
    }

    dateValidator(): ValidatorFn {
        return (c: FormControl): ValidationErrors => {
            if (!c.value) {
                return DateValidator.validationError('Required');
            }

            const date = new Date(c.value);
            const now = new Date();
            if (this.dateUtils.isEarlier(date, this.minDate)) {
                return DateValidator.validationError('Too early date - no quotes available');
            }

            if (this.dateUtils.isEarlier(now, date)) {
                return DateValidator.validationError('Date in future');
            }

            return null;
        };
    }
}
