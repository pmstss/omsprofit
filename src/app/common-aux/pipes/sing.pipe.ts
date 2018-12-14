import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sign',
    pure: true
})
export class SignPipe implements PipeTransform {
    transform(value: string): string {
        return value[0] !== '-' ? `+${value}` : value;
    }
}
