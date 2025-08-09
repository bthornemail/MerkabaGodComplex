let entries = [{
    "name": "NATIONAL GENERAL CO",
    "description": "PAYMENT" ,
    "id":1005005023,
    "amount": 458.17,
    "account": 932728590,
    "routing": 322271627,
    "date": "7/11/2022"
},
{
    "name": "Infinity Insuran",
    "description": "PAYMENT" ,
    "id":4310943862,
    "amount": 474.19	,
    "account": 438430923,
    "routing": 322271627,
    "date": "7/112/2022"
},
{
    "name": "WWW.NEXTINSUR CA ",
    "description": "PAYMENT" ,
    // "id":4310943862,
    "amount": 42.92	 + 37.25,
    "account": 438430923,
    "routing": 322271627,
    "date": "7/11/2022"
},
{
    "name": "primerica ",
    "description": "PAYMENT" ,
    // "id":4310943862,
    "amount": 99.99,
    // "account": 438430923,
    // "routing": 322271627,
    // "date": "7/11/2022"
},
{
    "name": "asurion ",
    "description": "PAYMENT" ,
    // "id":4310943862,
    "amount": 13,
    // "account": 438430923,
    // "routing": 322271627,
    // "date": "7/11/2022"
},
{
    "name": "public storage ",
    "description": "PAYMENT" ,
    // "id":4310943862,
    "amount": 26,
    // "account": 438430923,
    // "routing": 322271627,
    // "date": "7/11/2022"
},
{
    "name": "Lemonade ",
    "description": "PAYMENT" ,
    "id":"LP534F74547",
    "amount": 6.09,
    // "account": 438430923,
    // "routing": 322271627,
    // "date": "7/11/2022"
}]
console.log(entries.reduce((accum,entry)=>{
    return accum + entry.amount
},0));