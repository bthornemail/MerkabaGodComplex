import QRCode from 'qrcode'

/**
 * Generate private key image.
 * @returns {Promise} - A Promise resolving to the private key image
 */
export default async function createPrivateKeyImage(keyPair, passwd, type) {
    let image;
    switch (type) {
        case "dataUrl":
            image = await QRCode.toDataURL(await keyPair.export(passwd));
            break;
        case "png":
            image = await QRCode.toFile(passwd + ".png",await keyPair.export(passwd), { type: 'png', width: 256 });
            break;
        default:
            image = await QRCode.toString(await keyPair.export(passwd), { type: 'terminal', width: 256 });
            break;
    }
    console.log("Created Peer ID Private Key", image);
    return image;
}