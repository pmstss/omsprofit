import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonAuxModule } from '../common-aux';
import { AppStateStore } from './state/app-state-store';
import { MessageService } from './services/message.service';
import { MessageErrorHandler } from './services/message-error-handler';

@NgModule({
    imports: [
        HttpClientModule,
        CommonAuxModule
    ],
    providers: [
        AppStateStore,
        MessageService,
        { provide: ErrorHandler, useClass: MessageErrorHandler }
    ]
})
export class CoreModule {
}
