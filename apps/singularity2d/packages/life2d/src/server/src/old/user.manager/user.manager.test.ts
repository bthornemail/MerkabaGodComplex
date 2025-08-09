import * as secp from '@noble/secp256k1';
import VertTheory from "../vert.theory.js";
import User from "./user/user.js";
import { USER_AUTH, USER_AUTH_CREDENTIALS, USER_CREDENTIALS, CLOUD_USER, CLOUD_USER_SEED_JSON } from "./user.manager.types.js";
const json = require('../../public/json/users.sample.json')

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
        // postData('https://randomuser.me/api/?results=5&inc=name,gender,nat&noinfo', { answer: 42 })
        //     .then((data) => {
        //         console.log(data); // JSON data parsed by `data.json()` call
        //     });
        // fetch('http://localhost:40000/json/users.sample.json')
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(JSON.parse(JSON.stringify(data.results)))
        //         console.log(JSON.parse(JSON.stringify(data.results[0].location)))
        //         console.log(JSON.parse(JSON.stringify(data.results[0].location)))
        //     });
let vert: VertTheory = new VertTheory();
describe('User Manager', () => {
    let userAuthCredentials: USER_AUTH<string>;
    let userLoginCredentials: USER_CREDENTIALS<string>;
    let userProfileJSON: CLOUD_USER_SEED_JSON;
    let authUser: User;
    let userProfile: any;
    let newUser: any;
    beforeAll(() => {
        userAuthCredentials = {
            privateKey: "349ed18e9af6b93c6bed2187b657e0be370ea3a7c3393dc239e6d8b7343ff9ab",
            publicKey: "04adf6233923d714209f0cd7e69f433732b3eec9de9f708a0eb788790b0501c8e288c0799ab107f305fe68f2f0961bd6f1cf11ee1dd18905d8535c0a59dece54e9"
        };
    })
    beforeAll(async () => {
        let sampleUsers = Object(json).results;
        sampleUsers.map((user: CLOUD_USER_SEED_JSON) => {
            return vert.userManager.createUser(user);
        });
        // console.log(sampleUsers)
    })
    it("loads up user", async () => {
        newUser = await vert.userManager.createUser(userProfileJSON);
        // console.log("user", authUser)
        expect(authUser).toBeTruthy;
    });

    describe("creates admin user", () => {
        // console.log("user", authUser)
        beforeAll(async () => {
            newUser = await vert.userManager.createUser(userProfileJSON)
            // console.log("newUser", newUser)
        })
        it("has created admin user", async () => {
            expect(Array.from(vert.userManager.users).length).toBeGreaterThan(1);
        });
        it("has created cloud user", async () => {
            expect(Array.from(vert.userManager.adminUsers).length).toBeGreaterThan(1);
        });
        it("has cloud user and user admin synced", async () => {
            let adminUsers: User[] = Array.from(vert.userManager.adminUsers.values());
            // console.log("userManager.users", vert.userManager.users);
            // console.log("userManager.adminUsers", vert.userManager.adminUsers.values());
            // console.log("adminUsers[0]", adminUsers[0]);
            expect(vert.userManager.users.has(secp.utils.bytesToHex(adminUsers[0].publicKey))).toBeTruthy();
        });
    });
});