import express from 'express';
import vCardsJS from "vcards-js";
import { HDNodeWallet } from "ethers";
import QRCode from 'qrcode';
import { join } from "node:path";
// import { GRAPH_DATA, VCARD_INIT } from '../../../unity2d/types/graph';
import { Client, Server } from 'memjs';
const server = new Server("127.0.0.1", 11211)
const memcached = new Client([server], { retries: 10 });

const app = express();
type UNITY_GRAPH = { extendedKey: string; nodes: any[], links: { source: string, target: string }[],graph?: UNITY_GRAPH };

const graph: UNITY_GRAPH = {
    extendedKey: HDNodeWallet.createRandom().neuter().extendedKey,
    nodes: [],
    links: []
};

const context = {
    protocol: "http",
    host: "127.0.0.1",
    port: "3000",
    organization: "Life 2D"
}
//save to file

//    vCard.saveToFile('./eric-nesser.vcf');
//set content-type and disposition including desired filename

async function getVCardContext(vCard, context) {
    for (const [key, value] of Object.entries(context)) {
        vCard[key] = value;
    }
    vCard.photo.attachFromUrl(await QRCode.toDataURL('I am a pony!'));
    vCard.source = `${context.protocol}://${context.host}:${context.port}/download/${vCard.uid}.vcf`;
    vCard.url = `${context.protocol}://${context.host}:${context.port}/vcard/${vCard.uid}`;
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.get('/json', function (req, res, next) {
    res.json(graph);
});
app.post('/json', function (req, res, next) {
    if(!req.body.signature) return res.status(403);
    if(!req.body.extendedKey) return res.status(403);
    res.json(graph);
});
app.get('/identity', function (req, res) {
    res.json(HDNodeWallet.createRandom(req.body.password, "m/369/0"));
});
app.post('/identity', function (req, res) {
    if (req.body.phrase) return res.json(HDNodeWallet.fromPhrase(req.body.phrase,req.body.password,"m/369/0"));
    if (req.body.extendedKey) return res.json(HDNodeWallet.fromExtendedKey(req.body.extendedKey));
    graph.nodes.push(Object.entries(HDNodeWallet.createRandom(req.body.password, "m/369/0")))
    res.json( HDNodeWallet.createRandom(req.body.password, "m/369/0"));
});
app.get('/identity/:id', function (req, res, next) {
    //res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //send the response
    const host = HDNodeWallet.createRandom();
    const signer = HDNodeWallet.fromExtendedKey(req.params.id);
    // const signer = HDNodeWallet.createRandom();
    const vCard = vCardsJS();
    vCard.uid = signer.deriveChild(0).publicKey;
    vCard.organization = "Life 2d";
    vCard.photo.attachFromUrl("/images/src/logo.png", "PNG")
    vCard.url = "http://life2d.com/" + vCard.uid;
    vCard.role = "client";
    res.json(vCard.getFormattedString());
});
//Create a new vcard
app.get('/vcard', function (req, res, next) {
    const vCard = vCardsJS();
    const update = new Map();
    // for (const [key, value] of Object.entries(vCard)) {
    //     update.set(key,typeof value);
    // }
    res.json({...vCard,...HDNodeWallet.createRandom()});
});
app.post('/vcard', function (req, res, next) {
    //res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //send the response
    req.body.password ?? res.sendStatus(400).json({ error: "No Password" });
    const host = HDNodeWallet.createRandom();
    const signer = HDNodeWallet.createRandom();
    const vCard = vCardsJS();
    for (const [key, value] of Object.entries(req.body)) {
        vCard[key] = value;
    }
    vCard.uid = signer.deriveChild(0).extendedKey;
    // vCard.organization = "Life 2d";
    // vCard.photo.attachFromUrl("/images/src/logo.png","PNG")
    // vCard.url = "http://life2d.com/" + vCard.uid;
    // vCard.role = "client";
    res.json(vCard.getFormattedString());
    // res.redirect("vcard/"+ vCard.uid);
    // res.redirect("vcard.html?extendedKey=" + vCard.uid);
});
app.get('/vcard/:id', function (req, res, next) {
    //res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //send the response
    const host = HDNodeWallet.createRandom();
    const signer = HDNodeWallet.fromExtendedKey(req.params.id);
    // const signer = HDNodeWallet.createRandom();
    const vCard = vCardsJS();
    vCard.uid = signer.deriveChild(0).publicKey;
    vCard.organization = "Life 2d";
    vCard.photo.attachFromUrl("/images/src/logo.png", "PNG")
    vCard.url = "http://life2d.com/" + vCard.uid;
    vCard.role = "client";
    res.json(vCard.getFormattedString());
});

app.get('/vcard/:id/json', function (req, res, next) {
    //res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //send the response
    const host = HDNodeWallet.createRandom();
    const signer = HDNodeWallet.fromExtendedKey(req.params.id);
    // const signer = HDNodeWallet.createRandom();
    const vCard = vCardsJS();
    vCard.uid = signer.deriveChild(0).publicKey;
    vCard.organization = "Life 2d";
    vCard.photo.attachFromUrl("/images/src/logo.png", "PNG")
    vCard.url = "http://life2d.com/" + vCard.uid;
    vCard.role = "client";
    res.json(Object.entries(vCard));
});
app.get('/vcard/download', async function (req, res, next) {
    const vCard = vCardsJS();
    await getVCardContext(vCard, graph.nodes[0])
    res.set('Content-Type', `text/vcard; name="${vCard.uid}.vcf"`);
    res.set('Content-Disposition', `inline; filename="${vCard.uid}.vcf"`);
    //send the response
    res.send(vCard.getFormattedString());
});

app.get('/vcard/update', function (req, res, next) {
    const vCard = vCardsJS();
    res.set('Content-Type', `text/plain; name="${vCard.uid}.vcf"`);
    //res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
    // Object.entries(req.query).forEach(([key, value]) => {
    //     vCard[key] = value;
    // });
    // //send the response
    // res.send(vCard.getFormattedString());

    Object.entries(req.query).forEach(([key, value]) => {
        graph.nodes[0][key] = value;
    });
    //send the response
    res.send(graph.nodes[0].getFormattedString());
});

app.get('/vcard/json', function (req, res, next) {
    res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //res.set('Content-Disposition', 'inline; filename="enesser.vcf"');

    //send the response
    res.redirect("/vcard.html");
    // res.json(Object.entries(vCard));
});

app.get('/vcard/graph', function (req, res, next) {
    res.set('Content-Type', 'text/plain; name="enesser.vcf"');
    //res.set('Content-Disposition', 'inline; filename="enesser.vcf"');

    //send the response
    res.json(graph);
});

app.listen(3000, async () => {
    const vCard = vCardsJS();
    //set properties
    vCard.firstName = 'Eric';
    vCard.middleName = 'J';
    vCard.lastName = 'Nesser';
    vCard.uid = HDNodeWallet.createRandom().neuter().extendedKey;
    vCard.organization = 'ACME Corporation';

    //link to image
    vCard.photo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');

    //or embed image
    //vCard.photo.attachFromUrl('/path/to/file.jpeg');

    vCard.workPhone = '312-555-1212';
    vCard.birthday = new Date(1985, 0, 1);
    vCard.title = 'Software Developer';
    vCard.url = 'https://github.com/enesser';
    vCard.workUrl = 'https://acme-corporation/enesser';
    vCard.note = 'Notes on Eric';

    //set other vitals
    vCard.nickname = 'Scarface';
    vCard.namePrefix = 'Mr.';
    vCard.nameSuffix = 'JR';
    vCard.gender = 'M';
    vCard.anniversary = new Date(2004, 0, 1);
    vCard.role = 'Software Development';

    //set other phone numbers
    vCard.homePhone = '312-555-1313';
    vCard.cellPhone = '312-555-1414';
    vCard.pagerPhone = '312-555-1515';

    //set fax/facsimile numbers
    vCard.homeFax = '312-555-1616';
    vCard.workFax = '312-555-1717';

    //set email addresses
    vCard.email = 'e.nesser@emailhost.tld';
    vCard.workEmail = 'e.nesser@acme-corporation.tld';

    //set logo of organization or personal logo (also supports embedding, see above)
    vCard.logo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');

    //set URL where the vCard can be found
    // vCard.source = `${context.protocol}://${context.host}:${context.port}/download/${vCard.uid}.vcf`;

    //set address information
    vCard.homeAddress.label = 'Home Address';
    vCard.homeAddress.street = '123 Main Street';
    vCard.homeAddress.city = 'Chicago';
    vCard.homeAddress.stateProvince = 'IL';
    vCard.homeAddress.postalCode = '12345';
    vCard.homeAddress.countryRegion = 'United States of America';

    vCard.workAddress.label = 'Work Address';
    vCard.workAddress.street = '123 Corporate Loop\nSuite 500';
    vCard.workAddress.city = 'Los Angeles';
    vCard.workAddress.stateProvince = 'CA';
    vCard.workAddress.postalCode = '54321';
    vCard.workAddress.countryRegion = 'United States of America';

    //set social media URLs
    vCard.socialUrls['facebook'] = 'https://...';
    vCard.socialUrls['linkedIn'] = 'https://...';
    vCard.socialUrls['twitter'] = 'https://...';
    vCard.socialUrls['flickr'] = 'https://...';
    vCard.socialUrls['custom'] = 'https://...';

    //you can also embed photos from files instead of attaching via URL
    //vCard.photo.embedFromFile('photo.jpg');
    //vCard.logo.embedFromFile('logo.jpg');

    vCard.version = '3.0'; //can also support 2.1 and 4.0, certain versions only support certain fields
    await getVCardContext(vCard, context);
    console.log("hosting vcard",vCard)
    graph.nodes.push(vCard);
})


// //set basic properties shown before
// vCard.firstName = 'Eric';
// vCard.middleName = 'J';
// vCard.lastName = 'Nesser';
// vCard.uid = '69531f4a-c34d-4a1e-8922-bd38a9476a53';
// vCard.organization = 'ACME Corporation';

// //link to image
// vCard.photo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');

// //or embed image
// vCard.photo.attachFromUrl('/path/to/file.jpeg');

// vCard.workPhone = '312-555-1212';
// vCard.birthday = new Date(1985, 0, 1);
// vCard.title = 'Software Developer';
// vCard.url = 'https://github.com/enesser';
// vCard.workUrl = 'https://acme-corporation/enesser';
// vCard.note = 'Notes on Eric';

// //set other vitals
// vCard.nickname = 'Scarface';
// vCard.namePrefix = 'Mr.';
// vCard.nameSuffix = 'JR';
// vCard.gender = 'M';
// vCard.anniversary = new Date(2004, 0, 1);
// vCard.role = 'Software Development';

// //set other phone numbers
// vCard.homePhone = '312-555-1313';
// vCard.cellPhone = '312-555-1414';
// vCard.pagerPhone = '312-555-1515';

// //set fax/facsimile numbers
// vCard.homeFax = '312-555-1616';
// vCard.workFax = '312-555-1717';

// //set email addresses
// vCard.email = 'e.nesser@emailhost.tld';
// vCard.workEmail = 'e.nesser@acme-corporation.tld';

// //set logo of organization or personal logo (also supports embedding, see above)
// vCard.logo.attachFromUrl('https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', 'JPEG');

// //set URL where the vCard can be found
// vCard.source = 'http://mywebpage/myvcard.vcf';

// //set address information
// vCard.homeAddress.label = 'Home Address';
// vCard.homeAddress.street = '123 Main Street';
// vCard.homeAddress.city = 'Chicago';
// vCard.homeAddress.stateProvince = 'IL';
// vCard.homeAddress.postalCode = '12345';
// vCard.homeAddress.countryRegion = 'United States of America';

// vCard.workAddress.label = 'Work Address';
// vCard.workAddress.street = '123 Corporate Loop\nSuite 500';
// vCard.workAddress.city = 'Los Angeles';
// vCard.workAddress.stateProvince = 'CA';
// vCard.workAddress.postalCode = '54321';
// vCard.workAddress.countryRegion = 'United States of America';

// //set social media URLs
// vCard.socialUrls['facebook'] = 'https://...';
// vCard.socialUrls['linkedIn'] = 'https://...';
// vCard.socialUrls['twitter'] = 'https://...';
// vCard.socialUrls['flickr'] = 'https://...';
// vCard.socialUrls['custom'] = 'https://...';

// //you can also embed photos from files instead of attaching via URL
// vCard.photo.embedFromFile('photo.jpg');
// vCard.logo.embedFromFile('logo.jpg');

// vCard.version = '3.0'; //can also support 2.1 and 4.0, certain versions only support certain fields

// //save to file
// vCard.saveToFile('./eric-nesser.vcf');

// //get as formatted string
// console.log(vCard.getFormattedString());
