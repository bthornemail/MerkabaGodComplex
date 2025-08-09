import { HostWallet, ProviderWallet } from './data.js';
const defaultParams = {
    "host": HostWallet.publicKey,
    "provider": ProviderWallet.publicKey
}
export default async function getLink(signer, link, params) {
    // const location = "http://127.0.0.1:3000"
    function setParams(url){
        Object.entries(params ? { ...defaultParams, ...params } : defaultParams).forEach(([identity, publicKey]) => {
            url.searchParams.set(identity, publicKey);
        });    
    }
    if (!signer) {
        const url = link ? new URL(link, location) : new URL(location);
        setParams(url)
        return url.href
    }     
    if (signer) {
        if (signer.publicKey) {
            const url = link ? new URL(`${signer.publicKey}/${link}`, location) : new URL(signer.publicKey,location);
            setParams(url)
            return url.href;
        };
        const url = link ? new URL(`${signer}/${link}`, location) : new URL(signer,location);
        setParams(url)
        return url.href;
    };
    const url = link ? new URL(link, location) : new URL(location);
    setParams(url)
    return url.href;
}