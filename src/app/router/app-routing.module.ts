import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'profit', loadChildren: '../profit/profit.module#ProfitModule' },
    { path: 'details', loadChildren: '../details/details.module#DetailsModule' },
    { path: 'settings', loadChildren: '../settings/settings.module#SettingsModule' },
    { path: '**', redirectTo: '/profit' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            // enableTracing: true // TODO ### debug
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
