var express = require('express');
var socket = require('socket.io');
var jsonfile = require('jsonfile');
config = jsonfile.readFileSync( __dirname + '/config.json' );
var Watson = require('./model/watson.js')
var Cloudant = require('./model/cloudant.js')
var afterResponse = false;


//setup app
var app = express();
var port = process.env.PORT || 4001
var server = app.listen(port);
console.log('listening to port 4001');

var helloString = 'Hey there! Welcome to the Stock chat.' + 
' Which company would you like to learn about?';

var helpString = 'Would you like to learn about another company?';

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

  watson.talkToWatson('', getChart);

  var getChart = false;
  var helpText = false;    

  io.emit('chat', {message: helloString, fromUser: false});    

  console.log(socket.id)
  
  //Handle chat event
  socket.on('chat', function(userInput){
    getChart = false;
    console.log('insdide APP.jS RESPONSE')

    //Call Cloudant database on userInput
    cloudant.insert(userInput);    
    
    console.log('after Cloudant, before talk To Watson')

    watson.talkToWatson(userInput.message).then(function(output){

      console.log('output!!!!!!!!!!!!')
      console.log(output)
      console.log(output.length)
      getChart = output[1];
      console.log(getChart)      


      if (output.length >  200) {
        console.log('EMITT CHART!')
        io.emit('chat', {message: output[0][0]});
        afterResponse = true;        
      }
      else if (output.length > 100 && output.length < 200) {
        console.log('before io.emit(chat), message:output')
        console.log(getChart)
        io.emit('chat', {message: output});
        afterResponse = true;
      }
      else if (getChart === true){
        console.log('going into getChart')
        console.log(output[1])
        console.log(output[2])
        io.emit('chart', {message: output[2], fromUser: false});
        setTimeout(function(){ 
          io.emit('chat', {message: output[0], fromUser: false});      
          
         }, 1000);                                
      }

      else if (output.length === 2 && getChart !== false){
        console.log('output.length === 2 && !getChart')
        io.emit('chat', {message: output[1], fromUser: false});   
        
        setTimeout(function(){ 
          io.emit('chat', {message: output[0], fromUser: false});          
          
         }, 2000);             
      } else if (output.length === 3) {
        console.log('output length ===3: ')
        console.log(output)
        io.emit('chart', {message: output[2], fromUser: false});
        setTimeout(function(){ 
          io.emit('chat', {message: output[1], fromUser: false});                          
          io.emit('chat', {message: output[0], fromUser: false});      
         }, 1000); 
        

      }
      else if (output.length === 2) {
        console.log('INSIDE length = 2')
        io.emit('chat', {message: output[1], fromUser: false});   
        
        setTimeout(function(){ 
          io.emit('chat', {message: output[0], fromUser: false});          
          
         }, 2000); 
      }
      else {
        io.emit('chat', {message: output}); 
      }
    });
    io.emit('chat', {message:userInput, fromUser: true});
  });

  socket.on('chart', function(userInput){
    console.log('socket.on chart')
    getChart = true;
    helpText = true;
  
    watson.talkToWatson(userInput.message, getChart).then(function(output){
      io.emit('chart', {message: output});
    });
  });    
});