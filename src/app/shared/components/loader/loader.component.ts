import { Component, Input } from '@angular/core';
import { NgxLoadingConfig } from 'ngx-loading';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
    @Input() message: string;

    loaderConfig: NgxLoadingConfig = {
        primaryColour: '#467f98',
        secondaryColour: '#467f98',
        tertiaryColour: '#467f98',
        fullScreenBackdrop: true
    };
}
