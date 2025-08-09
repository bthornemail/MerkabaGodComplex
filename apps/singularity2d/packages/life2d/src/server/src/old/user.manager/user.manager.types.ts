import '../vert.theory.types.js'

type USER_PRIVATE_KEY = PRIVATE_KEY;
type USER_PUBLIC_KEY = PUBLIC_KEY;

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
export type USER_CREDENTIALS<UserType> = {
    username: UserType,
    password: UserType
}
export type USER_AUTH<UserType> = {
    privateKey: UserType;
    publicKey: UserType;
}
export type USER_AUTH_CREDENTIALS<UserType> = {
    privateKey: UserType;
    publicKey: UserType;
}
export type CLOUD_USER = CLOUD_USER_SEED_JSON & {
    login: {
        username: string,
        password: string,
    }
} 
