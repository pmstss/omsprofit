import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotesGuard } from '../core';

const routes: Routes = [
    { path: 'profit', loadChildren: '../profit/profit.module#ProfitModule', canActivate: [QuotesGuard] },
    { path: 'details', loadChildren: '../details/details.module#DetailsModule', canActivate: [QuotesGuard] },
    { path: 'settings', loadChildren: '../settings/settings.module#SettingsModule', canActivate: [QuotesGuard] },
    { path: '**', redirectTo: '/profit' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            // enableTracing: true // TODO ### for debug
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
