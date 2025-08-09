import { lookupService, lookup } from 'dns';

export default function checkInternetConnection(url: string = 'google.com') {
    return new Promise((resolve, reject) => {
        lookup(url, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    }).catch((err)=>{
        console.log(err)
    })
}
export function ping(ip: string = '8.8.8.8',port: number = 53) {
    return new Promise((resolve, reject) => {
        lookupService(ip, port, function (err, hostname, service) {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    }).catch((err)=>{
        console.log(err)
    })
}
