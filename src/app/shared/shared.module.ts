import { NgModule } from '@angular/core';
import { AssetNamePipe } from './pipes/asset-name.pipe';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxLoadingModule } from 'ngx-loading';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './components/message/message.component';

@NgModule({
    declarations: [AssetNamePipe, HeaderComponent, LoaderComponent, MessageComponent],
    imports: [
        CommonModule,
        NgxLoadingModule,
        RouterModule // routerLink is declared there
    ],
    exports: [AssetNamePipe, HeaderComponent, LoaderComponent, MessageComponent],
})
export class SharedModule {
}
