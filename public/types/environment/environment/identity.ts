import { HDNodeWallet } from 'ethers';
import * as secp from '@noble/secp256k1';
import EventRegister from './event.register';

export type IDENTITY = {
    extendedKey: string;
    phrase?: string;
    password?: string;
    entropy?: string;
    path?: string;
}
export type IDENTITY_INIT = {
    phrase?: string;
    path?: string;
    password: string;
}
export abstract class BaseIdentity {
    protected signer: HDNodeWallet;
    extendedKey: string;
    getPath() {
        return this.signer.path
    }
    constructor({ password, role }: { password?: string, role?: string }) {
        switch (role) {
            case "host":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/0");
                break;
            case "provider":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/1");
                break;
            case "client":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/2");
                break;
            case "context":
                this.signer = HDNodeWallet.createRandom(password, "m/369/0/3");
                break;
            case "environment":
            default:
                this.signer = HDNodeWallet.createRandom(password, "m/369/0");
                break;
        }
        this.extendedKey = this.signer.extendedKey
    }
}
export class PublicIdentity {
    privateKey = secp.utils.randomPrivateKey();
}
export class Identity extends BaseIdentity {
    protected events: EventRegister;
    constructor({ password, role }: { password?: string, role?: string }) {
        super({ password, role })
        this.events = new EventRegister();
    }
}
export type CLOUD_USER_SEED_JSON = {
    gender?: string,
    name?: {
        title?: string,
        first?: string,
        last?: string
    },
    location?: {
        street?: { number: number, name: string },
        city?: string,
        state?: string,
        country?: string,
        postcode?: number,
        coordinates?: { latitude: number, longitude: number },
        timezone?: { offset: string, description: string }
    },
    email?: string,
    login: {
        username: string,
        password: string,
    },
    dob?: { date: string },
    registered?: { date: string },
    phone?: string,
    cell?: string,
    id?: number,
    picture?: {
        large?: string,
        medium?: string,
        thumbnail?: string
    },
    nat?: string
}


export type VCARD_INIT = {
    /**
     * Specifies a value that represents a persistent, globally unique identifier associated with the vCard
     */
    uid: string;

    /**
     * Date of birth
     */
    birthday: Date;

    /**
     * Anniversary
     */
    anniversary: Date;

    /**
     * Cell phone number
     */
    cellPhone: string | string[];

    /**
     * Other cell phone number or pager
     */
    pagerPhone: string | string[];

    /**
     * The address for private electronic mail communication
     */
    email: string | string[];

    /**
     * The address for work-related electronic mail communication
     */
    workEmail: string | string[];

    otherEmail: string | string[];

    /**
     * First name
     */
    firstName: string;

    /**
     * Formatted name string associated with the vCard object (will automatically populate if not set)
     */
    formattedName: string;

    /**
     * Gender.
     */
    gender: "M" | "F";

    /**
     * Home mailing address
     */
    // homeAddress: Address;

    /**
     * Home phone
     */
    homePhone: string | string[];

    /**
     * Home facsimile
     */
    homeFax: string | string[];

    /**
     * Last name
     */
    lastName: string;

    /**
     * Logo
     */
    // logo: Photo;

    /**
     * Middle name
     */
    middleName: string;

    /**
     * Prefix for individual's name
     */
    namePrefix: string;

    /**
     * Suffix for individual's name
     */
    nameSuffix: string;

    /**
     * Nickname of individual
     */
    nickname: string;

    /**
     * Specifies supplemental information or a comment that is associated with the vCard
     */
    note: string;

    /**
     * The name and optionally the unit(s) of the organization associated with the vCard object
     */
    organization: string;

    /**
     * Whether or not this contact should be shown as a company
     */
    isOrganization: boolean;

    /**
     * Individual's photo
     */
    // photo: Photo;

    /**
     * The role, occupation, or business category of the vCard object within an organization
     */
    role: string;

    /**
     * Social URLs attached to the vCard object (ex: Facebook, Twitter, LinkedIn)
     */
    // socialUrls: SocialUrls;

    /**
     * A URL that can be used to get the latest version of this vCard
     */
    source: string;

    /**
     * Specifies the job title, functional position or function of the individual within an organization
     */
    title: string;

    /**
     * URL pointing to a website that represents the person in some way
     */
    url: string;

    /**
     * URL pointing to a website that represents the person's work in some way
     */
    workUrl: string;

    /**
     * Work mailing address
     */
    // workAddress: Address;

    /**
     * Work phone
     */
    workPhone: string | string[];

    /**
     * Work facsimile
     */
    workFax: string | string[];

    otherPhone: string | string[];

    /**
     * vCard version
     */
    version: string;

    /**
     * Get major version of the vCard format
     */
    getMajorVersion: () => number;

    /**
     * Get formatted vCard
     * @return Formatted vCard in VCF format
     */
    getFormattedString: () => string;

    /**
     * Save formatted vCard to file
     * @param filename - The file path
     */
    saveToFile: (filename: string) => void;
}
