import { Directive, Input } from '@angular/core';
import {
    NG_VALIDATORS,
    FormControl,
    ValidatorFn,
    Validator, ValidationErrors
} from '@angular/forms';

@Directive({
    selector: '[numberValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NumberValidator,
            multi: true
        }
    ]
})
export class NumberValidator implements Validator {
    @Input() validMax: number = Number.MAX_VALUE;
    @Input() validMin: number = 0;

    validator: ValidatorFn;

    constructor() {
        this.validator = this.numberValidator();
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

    numberValidator(): ValidatorFn {
        return (c: FormControl): ValidationErrors => {
            const value = +c.value;

            if (isNaN(value)) {
                return NumberValidator.validationError('Not a number');
            }

            if (value <= this.validMin) {
                return NumberValidator.validationError('Value is too low');
            }

            if (value >= this.validMax) {
                return NumberValidator.validationError('Value is too high');
            }

            return null;
        };
    }
}
