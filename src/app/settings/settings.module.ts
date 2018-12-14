import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonAuxModule } from '../common-aux';
import { SharedModule } from '../shared';
import { SettingsComponent } from './components/settings.component';
import { InvestmentComponent } from './components/investment/investment.component';
import { NumberValidator } from './components/investment/validators/number.validator';
import { DateValidator } from './components/investment/validators/date.validator';
import { SettingsGuard } from './guards/settings.guard';

@NgModule({
    declarations: [SettingsComponent, InvestmentComponent, NumberValidator, DateValidator],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsComponent,
                canDeactivate: [SettingsGuard]
            }
        ]),
        FormsModule,
        CommonAuxModule,
        SharedModule
    ],
    providers: [SettingsGuard],
    exports: [SettingsComponent]
})
export class SettingsModule {
}
