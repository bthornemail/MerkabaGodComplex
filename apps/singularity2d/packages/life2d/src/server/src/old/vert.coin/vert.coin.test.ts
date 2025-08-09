import TokenExchange from "./vert.coin.mjs"

describe("",()=>{
    let vert = new TokenExchange();
    let hash: any;
    it("",async ()=>{
        hash = await TokenExchange.mint({ hello: 'world' })
        expect(hash).toBeTruthy()
    })
})