import { HDNodeWallet,HDNodeVoidWallet } from 'ethers';
import { HostWallet, ProviderWallet } from '../../test/wallets.js'
import { iContext } from '../../types/context.js';
import { NODE } from '../../types/node.js';
import { UrlWithStringQuery } from 'url';
const defaultParams = {
    "host": HostWallet.publicKey,
    "provider": ProviderWallet.publicKey
}
export default function setLink(signer?: HDNodeWallet | HDNodeVoidWallet | string, node?: iContext & UrlWithStringQuery): string{
    function setParams(url: URL) {
        Object.entries(node ? node : defaultParams).forEach(([identity, publicKey]) => {
            url.searchParams.set(identity, publicKey as any);
        });
    }
    let location = `http://127.0.0.1:3000`
    if (node && (node.protocol, node.protocol, node.port)) {
        location = `${node?.protocol}://${node?.protocol}:${node?.port}`
    }
    if (!signer) {
        const url = node?.extendedKey ? new URL(node.extendedKey, location) : new URL(location);
        node ?? setParams(url)
        return url.href
    }
    //  Click Listeners for user 
    if ( typeof signer === "string") {
        const url = node?.extendedKey ? new URL(`${signer}/${node.extendedKey}`, location) : new URL(signer, location);
        node ??  setParams(url)
        return url.href;
    };
    if (signer.publicKey) {
        const url = node?.extendedKey ? new URL(`${signer.publicKey}/${node.extendedKey}`, location) : new URL(signer.publicKey, location);
        node ??  setParams(url)
        return url.href;
    };
    const url = node?.extendedKey ? new URL(node.extendedKey, location) : new URL(location);
    node ??  setParams(url)
    return url.href;
}
