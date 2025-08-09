import * as cheerio from 'cheerio';
//https://thispersondoesnotexist.com/
const $ = cheerio.load('<h2 class="title">Hello world</h2>');

$('h2.title').text('Hello there!');
$('h2').addClass('welcome');

$.html();
$('.apple', '#fruits').text();
//=> Apple

console.log($('body > img').attr('srcs'));
//=> pear

$('li[class=orange]').html();
//=> Orange

$('.pear').prop('outerHTML');

$ = cheerio.load('This is <em>content</em>.');
$('body').text();

/*
The "DOM Node" object
Cheerio collections are made up of objects that bear some resemblance to browser-based DOM nodes. You can expect them to define the following properties:

tagName
parentNode
previousSibling
nextSibling
nodeValue
firstChild
childNodes
lastChild
*/
