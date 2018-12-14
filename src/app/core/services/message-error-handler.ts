import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageType, MessageService } from './message.service';

@Injectable()
export class MessageErrorHandler extends ErrorHandler {
    constructor(private messageService: MessageService, private ngZone: NgZone) {
        super();
    }

    handleError(error) {
        super.handleError(error);
        const msg = error instanceof Error ? error.message : error.toString();
        // trigger change detection
        this.ngZone.run(
            () => this.messageService.publish({
                message: msg,
                type: MessageType.ERROR,
                timeout: 0
            }),
            0
        );
    }
}
