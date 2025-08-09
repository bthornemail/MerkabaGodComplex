import vCardsJS from 'vcards-js';
// var vCardsJS = require('vcards-js');
const defaultOptions = {
    // firstName: 'Eric',
    // middleName: 'J',
    // lastName: 'Nesser',
    // uid: '69531f4a-c34d-4a1e-8922-bd38a9476a53',
    organization: 'Life2D',
    // photo: {
    //   attachFromUrl: [
    //     { url: 'https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', type: 'JPEG' },
    //     { url: '/path/to/file.jpeg', type: 'image' }
    //   ],
    //   embedFromFile: 'public/src/images/input.png'
    // },
    // workPhone: '312-555-1212',
    // birthday: new Date(1985, 0, 1),
    // title: 'Software Developer',
    // url: 'https://github.com/enesser',
    workUrl: 'http://life2d.com',
    // note: 'Notes on Eric',
    // nickname: 'Scarface',
    // namePrefix: 'Mr.',
    // nameSuffix: 'JR',
    // gender: 'M',
    // anniversary: new Date(2004, 0, 1),
    role: 'client',
    // homePhone: '312-555-1313',
    // cellPhone: '312-555-1414',
    // pagerPhone: '312-555-1515',
    // homeFax: '312-555-1616',
    // workFax: '312-555-1717',
    // email: 'e.nesser@emailhost.tld',
    // workEmail: 'e.nesser@acme-corporation.tld',
    // logo: {
    //   attachFromUrl: { url: 'https://avatars2.githubusercontent.com/u/5659221?v=3&s=460', type: 'JPEG' },
    //   embedFromFile: 'public/src/images/icon.svg'
    // },
    source: 'http://life2d.com/myvcard.vcf',
    // homeAddress: {
    //   label: 'Home Address',
    //   street: '123 Main Street',
    //   city: 'Chicago',
    //   stateProvince: 'IL',
    //   postalCode: '12345',
    //   countryRegion: 'United States of America'
    // },
    // workAddress: {
    //   label: 'Work Address',
    //   street: '123 Corporate Loop\nSuite 500',
    //   city: 'Los Angeles',
    //   stateProvince: 'CA',
    //   postalCode: '54321',
    //   countryRegion: 'United States of America'
    // },
    // socialUrls: {
    //   facebook: 'https://...',
    //   linkedIn: 'https://...',
    //   twitter: 'https://...',
    //   flickr: 'https://...',
    //   custom: 'https://...'
    // },
    // version: '3.0',
    // saveToFile: './public/src/vcards/eric-nesser.vcf'
  };
  
function createVCard(options: Record<string,any> = defaultOptions){
  //create a new vCard
  var vCard = vCardsJS();
  
  Object.entries(Object.assign({},defaultOptions,options)).forEach(([key,value])=>{
    if (key === "logo") {
      vCard.logo.attachFromUrl(value, "PNG");
      return;
    }
    if (key === "photo") {
      vCard.photo.attachFromUrl(value, "PNG");
      return;
    }
    if(typeof vCard[key] === "string"){
        vCard[key] = value;
    }
    if(typeof vCard[key] === "object"){  
        Object.entries(value).forEach(([key1,value1])=>{
        if(typeof vCard[key][key1] === "string"){
            vCard[key][key1] = value1;
        }
        if(typeof vCard[key][key1] === "object"){  
            Object.entries(value1 as any).forEach(([key2,value2])=>{
            if(typeof vCard[key][key1][key2] === "string"){
                vCard[key][key1][key2] = value2;
            }
          })
        }
      })
    }
  })
  // vCard.uid = HostWallet.publicKey;
  // HostWallet.path ? vCard.source = `http://life2d.com/${HostWallet.path}/${HostWallet.fingerprint}` : `http://life2d.com/${HostWallet.publicKey}`
  // vCard.version = "3.0";
  // vCard.saveToFile(`./public/src/vcards/${vCard.uid}.vcf`);

  //get as formatted string
  console.log(vCard.getFormattedString());
  //send the response
  return vCard;
};

export default createVCard;