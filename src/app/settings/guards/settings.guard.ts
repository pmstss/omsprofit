import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { SettingsComponent } from '../components/settings.component';
import { DialogService } from '../../common-aux';

@Injectable()
export class SettingsGuard implements CanDeactivate<SettingsComponent> {
    constructor(private dialogService: DialogService) {
    }

    canDeactivate(component: SettingsComponent): boolean {
        if (component.isValid() && !component.isDirty()) {
            return true;
        }

        this.dialogService.alert({
            message: 'Please, save or reset changes first',
            title: 'Warning'
        });
    }
}
