
import getLink from "../bin/get.link.js";
import { HostWallet } from "../bin/wallets.js";
export default (async () => {

    if ('/registry') {
        console.log(await getLink(HostWallet,"brian"))
    }
    // if ('/register/:vcard') {
    //     const vCard = setVCard(req.body);
    //     console.log(req.body);
    //     if (!vCard) throw new Error("Not Found");
    //     vCard.uid = HostWallet.publicKey;
    //     HostWallet.path ? vCard.source = `http://life2d.com/${HostWallet.path}/${HostWallet.fingerprint}` : `http://life2d.com/${HostWallet.publicKey}`
    //     vCard.version = "3.0";
    //     vCard.saveToFile(`./public/src/vcards/${req.params.vcard}.vcf`);
    //     //set content-type and disposition including desired filename
    //     if (req.body.download) {
    //         res.set('Content-Type', `text/vcard; name="${req.params.vcard}.vcf"`);
    //         res.set(`Content-Disposition', 'inline; filename="${req.params.vcard}.vcf"`);
    //         //send the response
    //         res.send(vCard.getFormattedString());
    //     }
    //     res.redirect(`/registry/${req.params.vcard}`);
    //     // res.send(vCard.getFormattedString());
    // };
    // if ('/create/:vcard') {
    //     console.log(req);
    //     const vCard = setVCard(req.body);
    //     console.log(req.body);
    //     if (!vCard) throw new Error("Not Found");
    //     vCard.uid = req.body.publicKey;
    //     const path = req
    //     debugger;
    //     req.body.path ? vCard.source = `http://life2d.com/${req.body.path}/${req.body.fingerprint}` : `http://life2d.com/${req.body.publicKey}`
    //     vCard.version = "3.0";
    //     // vCard.saveToFile(`./public/src/vcards/${req.params.vcard}.vcf`);
    //     //set content-type and disposition including desired filename
    //     // if (req.body.download) {
    //     //     res.set('Content-Type', `text/vcard; name="${req.params.vcard}.vcf"`);
    //     //     res.set(`Content-Disposition', 'inline; filename="${req.params.vcard}.vcf"`);
    //     //     //send the response
    //     //     res.send(vCard.getFormattedString());
    //     // }
    //     // res.redirect(`/registry/${req.params.vcard}`);
    //     res.json(vCard.getFormattedString());
    // };
    // if ('/get/:vcard') {
    //     console.log(req.params)
    //     try {
    //         const vCard = readFileSync(join(__dirname, `../public/src/vcards/${req.params.vcard}.vcf`), "utf8");
    //         if (!vCard) throw new Error("Not Found");
    //         //set content-type and disposition including desired filename
    //         // res.set('Content-Type', 'text/vcard; name="enesser.vcf"');
    //         // res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
    //         //send the response
    //         return res.send(vCard);
    //     } catch (error) {
    //         return res.status(404).send(error);

    //     }
    // };
    // if ('/download/:vcard') {
    //     console.log(req.params)
    //     try {
    //         const vCard = readFileSync(join(__dirname, `../public/src/vcards/${req.params.vcard}.vcf`), "utf8");
    //         if (!vCard) throw new Error("Not Found");
    //         //set content-type and disposition including desired filename
    //         res.set('Content-Type', `text/vcard; name="${req.params.vcard}.vcf"`);
    //         res.set('Content-Disposition', `inline; filename=${req.params.vcard}.vcf"`);
    //         //send the response
    //         // console.log(vCard)
    //         return res.send(vCard);
    //     } catch (error) {
    //         return res.sendStatus(404).send(error);

    //     }
    // };
})();