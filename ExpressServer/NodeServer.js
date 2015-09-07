var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

app.use(express.static('.'));

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(3333, function(req,res) {
    console.log('Listening on port %d', server.address().port);
});

app.get('/', function(req, res) {
    console.log("At app.get /");
    fs.readFile(__dirname + '/index1.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/send', function (req, res) {
    console.log("At app.post /send");  

    var R = req.body.data;       
    console.log(R);
});

app.get('/recv', function (req, res) {
    console.log("At app.get /recv");  

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send({result:"Done"});
});
