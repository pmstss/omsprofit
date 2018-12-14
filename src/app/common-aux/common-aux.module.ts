import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentDateUtils } from './utils/date-utils';
import { ArrayUtilsImpl } from './utils/array-utils';
import { SignPipe } from './pipes/sing.pipe';
import { DialogService } from './services/dialog.service';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ModalModule } from 'ngx-bootstrap';

// tslint:disable-next-line:variable-name
export const DateUtilsToken = new InjectionToken('DateUtils');
// tslint:disable-next-line:variable-name
export const ArrayUtilsToken = new InjectionToken('ArrayUtils');

@NgModule({
    imports: [CommonModule, ModalModule.forRoot()],
    declarations: [SignPipe, ConfirmComponent],
    entryComponents: [ConfirmComponent],
    providers: [
        { provide: DateUtilsToken, useClass: MomentDateUtils },
        { provide: ArrayUtilsToken, useClass: ArrayUtilsImpl },
        DialogService
    ],
    exports: [SignPipe]
})
export class CommonAuxModule {
}
