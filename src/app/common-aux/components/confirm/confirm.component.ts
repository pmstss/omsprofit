import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

export class ButtonConfig {
    label = 'Yes';
    clazz = 'btn-primary';
    callback = () => {};
}

@Component({
    selector: 'modal-content',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
    title: string = 'Confirm';
    message: string = 'Are you sure?';

    buttons: ButtonConfig[] = [{
        label: 'Yes',
        clazz: 'btn-primary',
        callback: () => {}
    }, {
        label: 'No',
        clazz: 'btn-default',
        callback: () => {}
    }];

    constructor(public bsModalRef: BsModalRef) {}
}
