export type Asset = 'au' | 'pt' | 'ag' | 'pd';

export class AssetName {
    static getName(asset: Asset) {
        switch (asset) {
        case 'au':
            return 'Gold';
        case 'ag':
            return 'Silver';
        case 'pt':
            return 'Platinum';
        case 'pd':
            return 'Palladium';
        default:
            return 'Total';
        }
    }
}
