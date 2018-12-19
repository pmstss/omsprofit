import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'trimStacktrace',
    pure: true
})
export class TrimStacktracePipe implements PipeTransform {
    transform(value: string): string {
        return value.split('\n')[0];
    }
}
