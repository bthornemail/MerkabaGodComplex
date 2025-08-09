import EventEmitter from "node:events";
import { SERVICE_ANNOUNCEMENT_POST_JSON, SERVICE_CONSIDERATION_POST_JSON, SERVICE_NFT_ADDRESS, SERVICE_POST_METADATA_JSON, SERVICE_REQUEST_POST_JSON } from "./service.board.types.js";

export default class ServiceBoard  extends EventEmitter{
    services: Set<any>;
    postService = async (serviceDetails: SERVICE_POST_METADATA_JSON | SERVICE_REQUEST_POST_JSON | SERVICE_CONSIDERATION_POST_JSON | SERVICE_ANNOUNCEMENT_POST_JSON) => {
        // console.log(serviceDetails)
        this.services.add(serviceDetails);
        return serviceDetails;
    }
    stopService = async (address: SERVICE_NFT_ADDRESS) => {
        return true;
    }
    getService = (query: any) => {
        let services = Array.from(this.services.values());
        let service = services.find((service) => {
            return service.sid === query.sid;
        })
        return service;
    }
    getServices = async () => {
        let services = Array.from(this.services.values());
        return services;
    }
    create = async () => {
        return;
    }
    constructor() {
        super()
        this.services = new Set<any>();
    }

}