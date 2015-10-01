/**
 * blink1-server
 *
 *
 * @author Tod E. Kurt, http://todbot.com/blog
 *
 */

"use strict";

var Blink1 = require('node-blink1');
var parsecolor = require('parse-color');
var express = require('express');
var app = express();
app.set('json spaces', 4);

var port = 8080;

var devices = Blink1.devices(); // returns array of serial numbers
var blink1 = null;
if( devices.length ) {
    blink1 = new Blink1();
}

var lastColor = '#000000';
var lastTime = 0;
var lastLedn = 0;
var lastRepeats = 0;

// rescan if we know we have no blink1
var blink1TryConnect = function() {
    if( blink1 ) { return; }
    devices = Blink1.devices();
    if( devices.length ) {
        blink1 = new Blink1();
    }
};

// Call blink1.fadeToRGB while dealing with disconnect / reconnect of blink1
var blink1Fade = function( millis, r, g, b, ledn ){
    blink1TryConnect();
    if( !blink1 ) { return "no blink1"; }
    try {
        blink1.fadeToRGB( millis, r, g, b, ledn );
    } catch(err) {
        blink1 = null;
        return ""+err;
    }
    return "success";
};

app.get('/blink1', function(req, res) {
    blink1TryConnect();
    var response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "info",
        status: "success"
    };
    res.json( response );
});

app.get('/blink1/fadeToRGB', function(req, res) {
    var rgb;
    var time = Number(req.query.time) || 0.1;
    var ledn = Number(req.query.ledn) || 0;
    var status = "success";
    if( req.query.rgb ) {
        var color = parsecolor(req.query.rgb);
        if( !color.rgb ) {
            status = "bad hex color specified " + req.query.rgb;
        } else {
            rgb = color.rgb;
            lastColor = color.hex;
            lastTime = time;
            lastLedn = ledn;
            status = blink1Fade( time*1000, rgb[0], rgb[1], rgb[2], ledn );
        }
    }
    var response = {
        blink1Connected: blink1 !== null,
        blink1Serials: devices,
        lastColor: lastColor,
        lastTime: lastTime,
        lastLedn: lastLedn,
        lastRepeats: lastRepeats,
        cmd: "fadeToRGB",
        status: status
    };
    res.json( response );
});

// respond with "Hello World!" on the homepage
app.get('/', function(req, res) {
    res.send("<html>" +
        "<h2> Welcome to blink1-server</h2> \n" +
        "<p>" +
        "Supported URIs: <ul>\n" +
        "<li>   <code> /blink1 </code> " +
        " -- status info\n" +
        "<li>   <code> /blink1/fadeToRGB?rgb=%23FF00FF&time=1.5&ledn=2 </code> " +
        "-- fade to a RGB color over time for led\n" +
        "</ul></p>\n" +
        "When starting server, argument specified is port to run on, e.g.:" +
        "<code> blink1-server 8080 </code>\n" +
        "</html>");
});


// if we have args
if( process.argv.length > 2 ) {
    var p = Number(process.argv[2]);
    port = (p) ? p : port;
}

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    host = (host === '::' ) ? "localhost" : host;

    console.log('blink1-server listening at http://%s:%s/', host, port);
});
