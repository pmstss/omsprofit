import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CollapseModule } from 'ngx-bootstrap';
import { CommonAuxModule } from '../common-aux';
import { ProfitComponent } from './components/profit.component';
import { SharedModule } from '../shared';

@NgModule({
    declarations: [ProfitComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfitComponent
            }
        ]),
        FontAwesomeModule,
        CollapseModule,
        CommonAuxModule,
        SharedModule
    ],
    exports: [ProfitComponent]
})
export class ProfitModule {
}
