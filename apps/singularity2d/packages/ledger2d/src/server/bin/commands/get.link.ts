import { HDNodeWallet, HDNodeVoidWallet } from 'ethers';
import { HostWallet, ProviderWallet } from '../../test/wallets';
import { iContext, Context } from '../../types/context';
// import { HostWallet, ProviderWallet } from '../data/data';
// import { CONTENT, iContext, NODE } from '../types/context';
import { UrlWithStringQuery } from 'url';
import { Host } from '../../public/data/data';

let location = `http://127.0.0.1`
const defaultParams = {
    "host": HostWallet.publicKey,
    "provider": ProviderWallet.publicKey
}
export default function getLink(signer?: HDNodeVoidWallet | HDNodeWallet | string, node?: iContext & UrlWithStringQuery, p0?: { host: string; provider: string; }): string {
    function getParams(url: URL) {
        url.searchParams.forEach(([key, value]) => {
            if (node && !Object.keys(node).includes(key)) return url.searchParams.delete(key);
        })
        Object.entries(node ? node : defaultParams).forEach(([identity, publicKey]) => {
            url.searchParams.set(identity, publicKey);
        });
    }
    if (node && (node.protocol, node.protocol, node.port)) {
        location = `${node?.protocol}://${node?.protocol}:${node?.port}`
    }
    if (!signer) {
        const url = node?.extendedKey ? new URL(node.extendedKey, location) : new URL(location);
        node ?? getParams(url)
        return url.href
    }
    //  Click Listeners for user 
    if (typeof signer === "string") {
        const url = node?.extendedKey ? new URL(`${signer}/${node.extendedKey}`, location) : new URL(signer, location);
        node ?? getParams(url)
        return url.href;
    };
    if (signer.extendedKey) {
        const url = node?.extendedKey ? new URL(`${signer.extendedKey}/${node.extendedKey}`, location) : new URL(signer.extendedKey, location);
        node ?? getParams(url)
        console.log(url)
        return url.href;
    };
    const url = node?.extendedKey ? new URL(node.extendedKey, location) : new URL(location);
    node ?? getParams(url)
    return url.href;
};