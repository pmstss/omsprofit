import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageType, MessageService } from './message.service';

@Injectable()
export class MessageErrorHandler extends ErrorHandler {
    constructor(private messageService: MessageService, private ngZone: NgZone) {
        super();
    }

    handleError(error) {
        super.handleError(error);
        // trigger change detection
        this.ngZone.run(
            () => this.messageService.publish({
                message: error,
                type: MessageType.ERROR,
                timeout: 0
            }),
            0
        );
    }
}
