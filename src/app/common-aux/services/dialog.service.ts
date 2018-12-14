import { Injectable } from '@angular/core';
import { ButtonConfig, ConfirmComponent } from '../components/confirm/confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { first } from 'rxjs/operators';

export type DialogOptions = {
    message: string,
    title?: string,
    buttons?: ButtonConfig[]
};

@Injectable()
export class DialogService {
    constructor (private modalService: BsModalService) {
    }

    confirm(options: DialogOptions | string): Promise<boolean> {
        const opts = typeof options === 'string' ? {
            message: options
        } : options;

        return new Promise((resolve) => {
            this.modalService.show(ConfirmComponent, {
                class: 'modal-sm',
                initialState: Object.assign(
                    {
                        title: 'Confirm',
                        buttons: [{
                            label: 'Yes',
                            clazz: 'btn-primary',
                            callback: () => resolve(true)
                        }, {
                            label: 'No',
                            clazz: 'btn-default',
                            callback: () => resolve(false)
                        }]
                    },
                    opts
                )
            });

            this.modalService.onHide.pipe(first()).subscribe(() => resolve(false));
        });
    }

    alert(options: DialogOptions | string): Promise<boolean> {
        const opts = typeof options === 'string' ? {
            message: options
        } : options;

        return new Promise((resolve) => {
            this.modalService.show(ConfirmComponent, {
                class: 'modal-sm',
                initialState: Object.assign(
                    {
                        title: 'Info',
                        buttons: [{
                            label: 'Ok',
                            clazz: 'btn-primary',
                            callback: () => resolve(true)
                        }]
                    },
                    opts
                )
            });
        });
    }
}
