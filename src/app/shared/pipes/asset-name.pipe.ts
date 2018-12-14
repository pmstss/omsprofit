import { Pipe, PipeTransform } from '@angular/core';
import { Asset, AssetName } from '../../core';

@Pipe({ name: 'assetName' })
export class AssetNamePipe implements PipeTransform {
    transform(value: string): string {
        return AssetName.getName(<Asset><any>value);
    }
}
