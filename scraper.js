'use strict';
 
/**
* Web Scraper
*/
// Instead of the default console.log, you could use your own augmented console.log !
//var console = require('./console');



/**
 * Get arguments
 * Argument 0 is node
 * Argument 1 is file path
 * Argument 2 is the URL
 * Argument 3 is the keyword searched
 */


var a = process.argv;
var args = process.argv;
var site = args[2];
var keyword = args[3];

var colors = require('./node_modules/colors/');
var oldConsoleLog = console.log;
console.log = function() {

        var args = Array.prototype.slice(arguments);
        var retour;

        if(arguments[0] = "Loading..." )
        	{retour = arguments[0].redBG;}
        if(arguments[0] = "We got a new page!" )
        	{retour = arguments[0].green;}
        if(arguments[0] = "Oops an error occured on" )
        	{retour = arguments[0].magentaBG;}
        if(arguments[0] = "We got a link!" )
        	{retour = arguments[0].yellowBG;}

        if (arguments[1] != undefined) {
                oldConsoleLog(retour, arguments[1]);
        }
        else {
                oldConsoleLog(retour.cyanBG);
        }

};

 
// Url regexp from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
var EXTRACT_URL_REG = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
var PORT = 3000;
 
var request = require('request');
 
// See: http://expressjs.com/guide.html
var express = require('express');
var api = require('./monApi/api.js');

var app = express();
api.appSend(app);

api.PORTSend(PORT);
/*
-----------------------------------------------------------------------------------------------------------------------implementation a faire a partir ici
*/

// You should (okay: could) use your OWN implementation here!
var EventEmitter = require('events').EventEmitter;
 
// We create a global EventEmitter (Mediator pattern: http://en.wikipedia.org/wiki/Mediator_pattern )
var em = new EventEmitter();
 
/**
* Remainder:
* queue.push("http://..."); // add an element at the end of the queue
* queue.shift(); // remove and get the first element of the queue (return `undefined` if the queue is empty)
*
* // It may be a good idea to encapsulate queue inside its own class/module and require it with:
* var queue = require('./queue');
*/
var queue = [];

var fs = require('fs');


/*
//test ajout bdd
var mongoose = require('mongoose');
var html_str;

mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

var DataSchema = new mongoose.Schema({
  Lien : String,
  date : { type : Date, default : Date.now }
});

var DataModel = mongoose.model('commentaires',  DataSchema);
var data = new DataModel ({lien : html_str });

data.save(function (err) {
  if (err) { throw err; }
  console.log('data ajouté avec succès !');
});


//parse en json

var EJS = require('ejs');

//html = new EJS({url: '/template.ejs'}).render(data)
//new EJS({url:'/todo.ejs'}).update('todo','/todo.json')

*/ 
/**
* Get the page from `page_url`
* @param {String} page_url String page url to get
*
* `get_page` will emit
*/
function get_page(page_url){

//-------------------------- page_l undifined
//em.emit('largeur', page_url);

//-------------------------- page_h undifined
//em.emit('hauteur', page_url);




em.emit('page:scraping', page_url); 
// See: https://github.com/mikeal/request
request({
url:page_url,
}, function(error, http_client_response, html_str){
/**
* The callback argument gets 3 arguments.
* The first is an error when applicable (usually from the http.Client option not the http.ClientRequest object).
* The second is an http.ClientResponse object.
* The third is the response body String or Buffer.
*/
 

/*
-------------------------------------------------------------------------------------------------truc a faire ici aussi
*/ 

/**
* You may improve what get_page is returning by:
* - emitting HTTP headers information like:
* -> page size
* -> language/server behind the web page (php ? apache ? nginx ? using X-Powered-By)
* -> was compression active ? (Content-Encoding: gzip ?)
* -> the Content-Type
*/

if(error){
em.emit('page:error', page_url, error);
return;
}
 
em.emit('page', page_url, html_str);
});
}
 
/**
* get the height of the web page
* @param {String} html_page String that represents the HTML page
* 
*/
function page_height(html_page){
        var page_h = html_page.height;
        em.emit('hauteur' ,page_h);
}

/**
* get the width of the web page
* @param {String} html_page String that represents the HTML page
* 
*/
function page_width(html_page){
        var page_l = html_page.width;
        em.emit('largeur' ,page_l);
}
/**
* get the server language of the web page
* @param {String} html_page String that represents the HTML page
* 
*/

function language_server(html_page){

}

function active_compression(){

}

function content_type(){

}


/**
* Extract links from the web pagr
* @param {String} html_str String that represents the HTML page
*
* `extract_links` should emit an `link(` event each
*/

function extract_links(page_url, html_str){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
// "match" can return "null" instead of an array of url
// So here I do "(match() || []) in order to always work on an array (and yes, that's another pattern).
(html_str.match(EXTRACT_URL_REG) || []).forEach(function(url){
// see: http://nodejs.org/api/all.html#all_emitter_emit_event_arg1_arg2
// Here you could improve the code in order to:
// - check if we already crawled this url
// - ...
em.emit('url', page_url, html_str, url);
});
 
}
 
function handle_new_url(from_page_url, from_page_str, url){
// Add the url to the queue
queue.push(url);
 fs.appendFile('data.txt', url + '\r\n');

// ... and may be do other things like saving it to a database
// in order to then provide a Web UI to request the data (or monitoring the scraper maybe ?)
// You'll want to use `express` to do so
}
  

em.on('page:scraping', function(page_url){
console.log('Loading... ', page_url);

// Listen to events, see: http://nodejs.org/api/all.html#all_emitter_on_event_listener
em.on('page', function(page_url, html_str){
console.log('We got a new page!', page_url);
});
 
em.on('page:error', function(page_url, error){
console.error('Oops an error occured on', page_url, ' : ', error);
});
 
em.on('page', extract_links);

em.on('url', function(page_url, html_str, url){
    console.log('We got a link! ', url);
  
});
 
em.on('url', handle_new_url);


});

em.on('hauteur', function(html_str){
        console.log('hauteur de la page : ' , page_h);
});

em.on('largeur', function(html_str){
        console.log('largeur de la page : ' , page_l);
});


/*
-------------------------------------------------------------------------------------------------truc a faire ici aussi
*/ 
// A simple (non-REST) API
// You may (should) want to improve it in order to provide a real-GUI for:
// - adding/removing urls to scrape
// - monitoring the crawler state
// - providing statistics like
// - a word-cloud of the 100 most used word on the web
// - the top 100 domain name your crawler has see
// - the average number of link by page on the web
// - the most used top-level-domain (TLD: http://en.wikipedia.org/wiki/Top-level_domain )
// - ...
 
// You should extract all the following "api" related code into its own NodeJS module and require it with



//api.listen(PORT);
/*
app.get('/', function(req, res){
// See: http://expressjs.com/api.html#res.json
        res.json(200, {
                title:'YOHMC - Your Own Home Made Crawler',
                        endpoints:[{
                                url:'http://127.0.0.1:'+PORT+'/queue/size',
                                url:'http://127.0.0.1:'+PORT+'/queue/add?url=http%3A//voila.fr',
                                details:'immediately start a `get_page` on voila.fr.'
                        }, {
                                url:'http://127.0.0.1:'+PORT+'/queue/list',
                                details:'the current crawler queue list.'
                        }]
                });
});
 
app.get('/queue/size', function(req, res){
        res.setHeader('Content-Type', 'text/plain');
        res.json(200, {queue:{length:queue.length}});
});

app.get('/queue/add', function(req, res){
        var url = req.param('url');
        get_page(url);
        res.json(200, {
                queue:{
                        added:url,
                        length:queue.length,
                }
        });
});
 
app.get('/queue/list', function(req, res){
        res.json(200, {
                queue:{
                        length:queue.length,
                        urls:queue
                }
        });
});


 
app.listen(PORT);
console.log('Web UI Listening on port '+PORT);
*/


// #debug Start the crawler with a link

get_page(site);