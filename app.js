var express = require('express');
var socket = require('socket.io');
var jsonfile = require('jsonfile');
config = jsonfile.readFileSync( __dirname + '/config.json' );
var Watson = require('./model/watson.js')
var Cloudant = require('./model/cloudant.js')


//setup app
var app = express();
var port = process.env.PORT || 4001
var server = app.listen(port);
console.log('listening to port 4001');

var helloString = 'Greetings from the stock bot.' + 
' Type in the name or ticker of a company, ' + 
'and I will tell you what I know about it.'
var helpString = 'Would you like to learn about another company?'

app.use(express.static('views'));

app.use(function (req, res, next){
    
      req.config = config;
    
      next();
    
    });

let watson = new Watson();


let cloudant = new Cloudant();

//Socket setup & server
var io = socket(server);
io.on('connection', function(socket){

    var getChart = false;
    var helpText = false;    

    io.emit('chat', {message: helloString});    

    console.log(socket.id)
    
    //Handle chat event
    socket.on('chat', function(userInput){
        getChart = false;
        console.log('insdide APP.jS RESPONSE')

        //Call Cloudant database on userInput
        cloudant.insert(userInput);        

        watson.talkToWatson(userInput.message, getChart).then(function(output){
            
            io.emit('chat', {message: output})
            
        });
        
        io.emit('chat', userInput);
    });

    socket.on('chart', function(userInput){
        getChart = true;
        helpText = true;
      
        watson.talkToWatson(userInput.message, getChart).then(function(output){
            
            io.emit('chart', {message: output});
             
        });
                
    });    

});