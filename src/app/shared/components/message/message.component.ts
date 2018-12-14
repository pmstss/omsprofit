import { Component, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, Message, MessageType } from '../../../core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe } from '../../../common-aux';

const MAX_MESSAGES = 3;

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
    animations: [
        trigger('fadeAnimation', [
            state('in', style({ left: 0, opacity: 0.9 })),

            transition('void => *', [
                style({ left: '-100%', opacity: 0 }),
                animate(300)
            ]),

            transition('* => void', [
                animate(300, style({ left: '100%', opacity: 0 }))
            ])
        ])
    ]
})
export class MessageComponent {
    messages: Message[] = [];
    differ: KeyValueDiffer<string, any>;

    @AutoUnsubscribe private subscription: Subscription;

    constructor(private messageService: MessageService, private keyValueDiffers: KeyValueDiffers) {
        this.subscription = messageService.getMessages().subscribe((msg: Message) => {
            while (this.messages.length >= MAX_MESSAGES) {
                this.messages.pop();
            }

            const differ = keyValueDiffers.find({}).create();
            differ.diff(this.messages[0] || {});
            const diff = differ.diff(msg);
            if (!diff) {
                this.messages.shift();
            }

            this.messages.unshift(msg);
            if (msg.timeout) {
                setTimeout(() => this.clear(msg), msg.timeout);
            }
        });
    }

    clear(msg) {
        const idx = this.messages.indexOf(msg);
        if (idx >= 0) {
            this.messages.splice(idx, 1);
        }
    }

    getClass(msg) {
        switch (msg.type) {
        case MessageType.ERROR:
            return 'alert-danger';
        case MessageType.WARN:
            return 'alert-warning';
        case MessageType.INFO:
            return 'alert-info';
        case MessageType.SUCCESS:
            return 'alert-success';
        default:
            return 'alert-danger';
        }
    }
}
