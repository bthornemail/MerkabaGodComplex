import path from 'path';
import { Request, Response } from "express";
import EventEmitter from 'events';
export default class AssetManager  extends EventEmitter {
    io: any;
    socket: any;
    assets: Set<any>;

    public postAsset = async (assetDetails: any) => {
        // console.log(assetDetails)
        this.assets.add(assetDetails);
        return assetDetails;
    };
    public removeAsset = (assetDetails: any) => {
        this.assets.delete(assetDetails);
        return assetDetails;
    };
    public getAsset = (query: any) => {
        let assets = Array.from(this.assets.values());
        let asset = assets.find((asset) => {
            return asset.sid === query.sid;
        })
        return asset;
    }
    public getAssets = async () => {
        let assets = Array.from(this.assets.values());
        return assets;
    }

    constructor() {
        super();
        this.assets = new Set<any>();
    }

}