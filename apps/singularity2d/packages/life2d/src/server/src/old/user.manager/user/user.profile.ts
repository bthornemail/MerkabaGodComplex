import EventEmitter from "node:events";
import { CLOUD_USER_SEED_JSON, CLOUD_USER } from '../user.manager.types.js';

export default function UserProfile(userProfileSeedJSON: CLOUD_USER_SEED_JSON): CLOUD_USER{
    return Object.assign({},userProfileSeedJSON,{
        name: { first: "", last: "" },
        email: "",
    })
}