import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './router/app-routing.module';
import { CoreModule } from './core';
import { QuotesModule } from './quotes';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        QuotesModule,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
