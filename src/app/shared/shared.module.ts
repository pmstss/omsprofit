import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssetNamePipe } from './pipes/asset-name.pipe';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxLoadingModule } from 'ngx-loading';
import { MessageComponent } from './components/message/message.component';
import { TrimStacktracePipe } from './components/message/trim.stacktrace.pipe';

@NgModule({
    declarations: [AssetNamePipe, HeaderComponent, LoaderComponent, MessageComponent, TrimStacktracePipe],
    imports: [
        CommonModule,
        NgxLoadingModule,
        RouterModule // routerLink is declared there
    ],
    exports: [HeaderComponent, LoaderComponent, MessageComponent, AssetNamePipe],
})
export class SharedModule {
}
