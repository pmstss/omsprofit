import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum MessageType {
    INFO, WARN, ERROR, SUCCESS
}

export type Message = {
    type: MessageType,
    message: string,
    timeout?: number
};

@Injectable()
export class MessageService {
    private subject = new Subject<Message>();

    publish(msg: Message) {
        this.subject.next(msg);
    }

    getMessages(): Observable<Message> {
        return this.subject;
    }
}
