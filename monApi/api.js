var app;
var appSend = function(appEnvoye) {
  app = appEnvoye;
};

var PORT;
var PORTSend = function(PORTEnvoye){
    PORT = PORTEnvoye;
};


if(app!==undefined){
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
}

if(app!==undefined){
    app.get('/queue/size', function(req, res){
            res.setHeader('Content-Type', 'text/plain');
            res.json(200, {queue:{length:queue.length}});
    });
}

if(app!==undefined){
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
}

if(app!==undefined){
    app.get('/queue/list', function(req, res){
            res.json(200, {
                    queue:{
                            length:queue.length,
                            urls:queue
                    }
            });
    });
}


if(app!==undefined){
    app.listen(PORT);
}

if(app!==undefined){
 app.get('/stats/linkscount', function(req, res){
    var fs = require('fs');
    var data=(String)(fs.readFileSync('./data.txt')).split('\n');
    res.setHeader('Content-Type', 'text/plain');
    res.json(200, {length: data.length});
  });
}

console.log('Web UI Listening on port '+PORT);



module.exports.appSend = appSend;
module.exports.app = app;

module.exports.PORTSend = PORTSend;
module.exports.PORT = PORT;
