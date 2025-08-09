import { SERVICE_POST_METADATA_JSON } from "./service.board.types.js";
import VertTheory from "../vert.theory.js";

let vert: VertTheory = new VertTheory();
describe('Service Board', () => {
    let postedService: SERVICE_POST_METADATA_JSON;
    it("loads up service board", async () => {
        let services = await vert.serviceBoard.getServices();
        // console.log(services)
        expect(services).toBeTruthy;
    });
    it("adds service to service board", async () => {
        postedService = await vert.serviceBoard.postService({
            title: "TITLE_STRING",
            summary: "SUMMARY_STRING",
            description: "string | undefined"
        });
        let services = await vert.serviceBoard.getServices()
        // console.log(services)
        expect(services).toHaveLength(1);
    });
    it("get service from service board", async () => {
        let serviceRequest = await vert.serviceBoard.getService(postedService);
        // console.log(serviceRequest)
        expect(serviceRequest).toBeInstanceOf<SERVICE_POST_METADATA_JSON>;
    });
});