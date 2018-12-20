import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'message',
    pure: true
})
export class MessagePipe implements PipeTransform {
    transform(value: any): string {
        return (value instanceof Error ? value.message : value.toString());
    }
}
