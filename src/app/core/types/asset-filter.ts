import { Asset, AssetName } from './asset';

export interface AssetFilterData {
    asset: Asset;
    enabled: boolean;
}

export class AssetFilter implements AssetFilterData {
    asset: Asset;
    enabled: boolean;

    constructor(data: AssetFilterData) {
        this.asset = data.asset;
        this.enabled = data.enabled;
    }

    static deserialize(data: AssetFilterData): AssetFilter {
        return new AssetFilter(data);
    }

    serialize(): AssetFilterData {
        return {
            asset: this.asset,
            enabled: this.enabled
        };
    }

    isTotalFilter(): boolean {
        return this.asset === null;
    }

    get name(): string {
        return AssetName.getName(this.asset);
    }
}
