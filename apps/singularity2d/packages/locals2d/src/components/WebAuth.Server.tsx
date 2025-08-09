import { useRef, useState } from 'react';
import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
    RegistrationResponseJSON,
    AuthenticationResponseJSON
} from '@simplewebauthn/server';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';

type UserModel = {
    id: any;
    username: string;
};

/**
 * It is strongly advised that credentials get their own DB
 * table, ideally with a foreign key somewhere connecting it
 * to a specific UserModel.
 *
 * "SQL" tags below are suggestions for column data types and
 * how best to store data received during registration for use
 * in subsequent authentications.
 */
type Passkey = {
    // SQL: Store as `TEXT`. Index this column
    id: Base64URLString;
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    //      Caution: Node ORM's may map this to a Buffer on retrieval,
    //      convert to Uint8Array as necessary
    publicKey: Uint8Array;
    // SQL: Foreign Key to an instance of your internal user model
    user: UserModel;
    // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
    //      (webAuthnUserID + user) also achieves maximum user privacy
    webauthnUserID: Base64URLString;
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    deviceType: CredentialDeviceType;
    // SQL: `BOOL` or whatever similar type is supported
    backedUp: boolean;
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    transports?: AuthenticatorTransportFuture[];
};


/**
* Human-readable title for your website
*/
const rpName = 'SimpleWebAuthn Example';
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
const rpID = 'simplewebauthn.dev';
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
const origin = `https://${rpID}`;
export function WebAuthNServerRegistration() {
    //   const startRegistration = useRef();
    const elemBegin = useRef<any>(null);
    const elemSuccess = useRef<any>(null);
    const elemError = useRef<any>(null);
    const [registrationOptions, setRegistrationOptions] = useState<Map<UserModel, PublicKeyCredentialCreationOptionsJSON>>(new Map());

    // (Pseudocode) Retrieve the user from the database
    // after they've logged in
    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    // const userPasskeys: Passkey[] = getUserPasskeys(user);

    async function get(user: UserModel, userPasskeys: Passkey[]) {
        const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: user.username,
            // Don't prompt users for additional information about the authenticator
            // (Recommended for smoother UX)
            attestationType: 'none',
            // Prevent users from re-registering existing authenticators
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                // Optional
                transports: passkey.transports,
            })),
            // See "Guiding use of authenticators via authenticatorSelection" below
            authenticatorSelection: {
                // Defaults
                residentKey: 'preferred',
                userVerification: 'preferred',
                // Optional
                authenticatorAttachment: 'platform',
            },
        });

        // (Pseudocode) Remember these options for the user
        setRegistrationOptions((registrations) => {
            return registrations.set(user, options)
        });

        return options;
    }
    // // (Pseudocode) Retrieve the logged-in user
    // const  user: UserModel = getUserFromDB(loggedInUserId);
    // // (Pseudocode) Get `options.challenge` that was saved above
    // const currentOptions: PublicKeyCredentialCreationOptionsJSON =
    //     getCurrentRegistrationOptions(user);
    async function post(user: UserModel, response: RegistrationResponseJSON, currentOptions: PublicKeyCredentialCreationOptionsJSON) {
        let verification;
        const options = registrationOptions.get(user);
        try {
            verification = await verifyRegistrationResponse({
                response: response,
                expectedChallenge: options?.challenge ?? currentOptions.challenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
            });
        } catch (error) {
            console.error(error);
            // return res.status(400).send({ error: error.message });
        }
        if (!verification) throw new Error("Not verified");
        if (verification.verified) {
            // 3. Post-registration responsibilities
            // Assuming verification.verified is true then RP's must, at the very least, save the credential data in registrationInfo to the database:
            
            // const { registrationInfo } = verification;
            // const {
            //   credential,
            //   credentialDeviceType,
            //   credentialBackedUp,
            // } = registrationInfo;
            
            // const newPasskey: Passkey = {
            //   // `user` here is from Step 2
            //   user,
            //   // Created by `generateRegistrationOptions()` in Step 1
            //   webAuthnUserID: currentOptions.user.id,
            //   // A unique identifier for the credential
            //   id: credential.id,
            //   // The public key bytes, used for subsequent authentication signature verification
            //   publicKey: credential.publicKey,
            //   // The number of times the authenticator has been used on this site so far
            //   counter: credential.counter,
            //   // How the browser can talk with this credential's authenticator
            //   transports: credential.transports,
            //   // Whether the passkey is single-device or multi-device
            //   deviceType: credentialDeviceType,
            //   // Whether the passkey has been backed up in some way
            //   backedUp: credentialBackedUp,
            // };
            
            // // (Pseudocode) Save the authenticator info so that we can
            // // get it by user ID later
            // saveNewPasskeyInDB(newPasskey);
        }
        return verification.verified;
    }
    return (<div>
        <button ref={elemBegin} onClick={() => {
            get({
                id: "new-user",
                username: "FirstUser"
            }, [])
        }}>Get Registration Options</button>
        <span ref={elemSuccess}></span>
        <span ref={elemError}></span>
    </div>)
}
export function WebAuthNServerAuthentication() {
    //   const startRegistration = useRef();
    const elemBegin = useRef<any>(null);
    const elemSuccess = useRef<any>(null);
    const elemError = useRef<any>(null);
    const [authenticationOptions, setAuthenticationOptions] = useState<Map<UserModel, PublicKeyCredentialRequestOptionsJSON>>(new Map());

    // (Pseudocode) Retrieve the user from the database
    // after they've logged in
    // (Pseudocode) Retrieve any of the user's previously-
    // registered authenticators
    // const userPasskeys: Passkey[] = getUserPasskeys(user);

    async function get(user: UserModel, userPasskeys: Passkey[]) {
        const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
            rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
        });

        // (Pseudocode) Remember these options for the user
        setAuthenticationOptions((authentications) => {
            return authentications.set(user, options)
        });

        return options;
    }

    // // (Pseudocode) Retrieve the logged-in user
    // const user: UserModel = getUserFromDB(loggedInUserId);
    // // (Pseudocode) Get `options.challenge` that was saved above
    // const currentOptions: PublicKeyCredentialRequestOptionsJSON =
    //   getCurrentAuthenticationOptions(user);
    // // (Pseudocode} Retrieve a passkey from the DB that
    // // should match the `id` in the returned credential
    // const passkey: Passkey = getUserPasskey(user, body.id);
    async function post(user: UserModel, passkey: Passkey, response: AuthenticationResponseJSON, currentOptions: PublicKeyCredentialCreationOptionsJSON) {
        if (!passkey) {
            throw new Error(`Could not find passkey ${response.id} for user ${user.id}`);
        }

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: response,
                expectedChallenge: currentOptions.challenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                credential: {
                    id: passkey.id,
                    publicKey: passkey.publicKey,
                    counter: passkey.counter,
                    transports: passkey.transports,
                },
            });
        } catch (error) {
            console.error(error);
            return;
        }

        const { verified } = verification;
        if (verified) {
            //             3. Post-authentication responsibilities
            // Assuming verification.verified is true, then update the user's authenticator's counter property in the DB:

            // const { authenticationInfo } = verification;
            // const { newCounter } = authenticationInfo;

            // saveUpdatedCounter(passkey, newCounter);
        }
        return verification.verified;
    }
    return (<div>
        <button ref={elemBegin} onClick={() => {
            get({
                id: "new-user",
                username: "FirstUser"
            }, [])
        }}>Get Registration Options</button>
        <span ref={elemSuccess}></span>
        <span ref={elemError}></span>
    </div>)
}   