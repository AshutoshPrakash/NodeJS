var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var net = require('net');
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var RQ = require("./redis_query.js");
var MAP = {};

app.use(express.static('.'));

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(8000, function (req,res) {
    console.log('Server : Listening on port %d', server.address().port);
});

app.get('/', function (req, res) {
    var port = req.socket.remotePort;
    console.log("Server : Connection with "+port);
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        if(!err)res.send(text);
        else console.log('Server : In event / '+err);
    });
});

app.get('/signup', function (req, res) {
    var port = req.socket.remotePort;
    console.log("Server : signup.html from "+port);
    fs.readFile(__dirname + '/signup.html', 'utf8', function(err, text){
        if(!err)res.send(text);
        else console.log('Server : In event /signup '+err);
    });
});

app.post('/check', function (req, res) {//recieve json from UI
    var port = req.socket.remotePort;
    console.log('Server : recieved a login request from '+port);
    
    var name = req.body.name;
    var email = req.body.email;
    var user = req.body.user;
    var pass = req.body.pass;
    console.log("Server : user = "+user);
    console.log("Server : mail = "+email);
    console.log("Server : pass = "+pass);
    console.log("Server : name = "+name);
    if(email!=undefined){
        RQ.NewUser(user,pass,name,email,function(e,o){
            //send successful Sign Up thats why Login now
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send({redirect: '/'});
        });
    }
    else{
        RQ.CheckLogin(user,pass,function(e,o){
            if(o=="Done"){
                console.log("Server : Login Success for USER:"+user);
                MAP[port] = user;
                WriteHtml(user,function(o){
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    //res.statusCode = 200;
                    res.send({page:o});//sending an html in response
                });
            }
            else{
                console.log("Server : Login Failed for USER:"+user);
                res.setHeader("Access-Control-Allow-Origin", "*");
                //res.statusCode = 200;
                res.send({redirect: '/',error:e});
            }
        });
    }
});

function WriteHtml(user,callback){
    fs.readFile(__dirname + '/profile.html', 'utf8', function(err, text){
        if(!err){
            text = text.replace('Dude',user);
            callback(text);
        }
        else {
            console.log('Server : In fn WriteHtml '+err);
            callback("ERROR");
        }
    });
}

/*setInterval(function(){
    console.log('****************Current Users*********************');
    for(var i in MAP){
        console.log(" From Port="+i+" LoggedIn user is "+MAP[i]);
    }
    console.log('**************************************************');
},6000);*/

/*app.get('/profile', function (req, res) {
    var port = req.socket.remotePort;
    if(MAP[port]!=undefined){
        console.log("Server : profile request from "+port);
        fs.readFile(__dirname + '/profile.html', 'utf8', function(err, text){
            if(!err)res.send(text);
            else console.log('Server : In event /profile '+err);
        });
    }
    else{
        console.log('Server : Invalid profile from '+port);
        res.send('Invalid ... Use Login page !!');
    }
});
*/
