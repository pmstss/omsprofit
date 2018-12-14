import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartistModule } from 'ngx-chartist';
import { CommonAuxModule } from '../common-aux';
import { DetailsComponent } from './components/details.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
    declarations: [DetailsComponent, ChartComponent, TableComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: DetailsComponent,
                children: [
                    { path: '', redirectTo: 'chart' },
                    { path: 'chart', component: ChartComponent },
                    { path: 'table', component: TableComponent }
                ]
            }
        ]),
        NgxChartistModule,
        CommonAuxModule
    ],
    exports: [DetailsComponent]
})

export class DetailsModule {
}
