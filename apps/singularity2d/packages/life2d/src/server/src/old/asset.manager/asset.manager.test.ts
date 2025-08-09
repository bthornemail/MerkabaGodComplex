import { ASSET_POST_JSON } from './asset.manager.types.js'
import VertTheory from "../vert.theory.js";
import { describe, it, expect } from 'node:test';
    let vert: VertTheory = new VertTheory();
    describe('Asset Manager', () => {
        let postedAsset: ASSET_POST_JSON;
        it("loads up asset board", async () => {
            let assets = await vert.assetManager.getAssets();
            // console.log(assets)
            expect(assets).toBeTruthy;
        });
        it("adds asset to asset board", async () => {
            postedAsset = await vert.assetManager.postAsset({
                title: "TITLE_STRING",
                summary: "SUMMARY_STRING",
                description: "string | undefined"
            });
            let assets = await vert.assetManager.getAssets()
            // console.log(assets)
            expect(assets).toHaveLength(1);
        });
        it("get asset from asset board", async () => {
            let assetRequest = await vert.assetManager.getAsset(postedAsset);
            // console.log(assetRequest)
            expect(assetRequest).toBeInstanceOf<ASSET_POST_JSON>;
        });
    });