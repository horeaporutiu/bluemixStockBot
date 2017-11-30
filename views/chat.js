// Make Connection
var socket = io.connect('http://localhost:4001');
// var socket = io.connect('https://stockbot.mybluemix.net');

var messageCount = 0;
var isUser = true;
var fromWatson = 'watson';
var fromUser = 'user';
var firstTime = true;
var firstInput = true;
var divCounter = 1;
var getChart = true;


//Query DOM 
var output = document.getElementById('output'),
    message = document.getElementById('message'),
    translate = document.getElementById('translate'),
    pointer = document.getElementById('fontAwsome'),
    bottomDiv = document.getElementById('sendArrow'),        
    chatDiv = document.getElementById('chat-window');

message.addEventListener('keypress', function(key){
    if (key.keyCode === 13 ) {
        socket.emit('chat', {
            message: message.value,
        });
        if(getChart){
            socket.emit('chart', {
                message: message.value
            });
        }
        // console.log(message.value);    
        message.value = '';    
        
        // if(getChart){
        //     socket.emit('chart', {
        //         message: message.value
        //     });
        // }
        
        // TODO: uncoomment line below. that one is only for debugging purposes
    }
    
})

//Write message when user clicks on paper plane icon
pointer.addEventListener("click", function(){ 
    socket.emit('chat', {
        message: message.value,
    });
    if(getChart){
        socket.emit('chart', {
            message: message.value
        });
    }
    console.log(message.value);    
    message.value = '';    
    
});


socket.on('chat', function(data, helpText){ 
    
        console.log('chat')
        console.log('data: ')
        console.log(data)
        
        console.log('helpText')
        console.log(helpText)        
        if(!helpText){
            messageCount++;            
        }
        
            if (messageCount % 2 === 0) {
        
                output.innerHTML += '<div class=' + fromUser + '>' + '<div class=' + 'bubble' + '>'+ '<p>' + data.message + '</p>' + '</div>'+ '</div>'; 
        
            } else {
    
                output.innerHTML += '<div class=' + fromWatson + '>' + '<div class=' + 'bubble' + '>'+ '<p>' + data.message + '</p>' + '</div>'+ '</div>'; 
                
            }
    
        chatDiv.scrollTop = chatDiv.scrollHeight;
    
    });

socket.on('chart', function(data){

    console.log('data')
    console.log(data)

    console.log('chart messageCount: ')
    console.log(messageCount)
    // messageCount++;
    

    var i = 0;
    var k = 0;
    var Arr2 = [];
    var Arr1 = [];

    if (data.message !== undefined) {

        console.log('dataMessage: ')
        console.log(data.message)
 
        var j = data.message.length -1;
        console.log('dataMessageLength: ')
        console.log(j)
        
        for (i = 0; i < data.message.length ; i++){
            Arr1 = [];
            Arr1[k] = data.message[j].date;
            Arr1[k+1] = data.message[j].close;      
            Arr2[i] = Arr1;
            j--;
        }
        console.log('arr2')
        console.log(Arr2)

        output.innerHTML += '<div class=' + fromWatson + '>' 
            + '<div class=' + 'bubble' + '>'
            + '<div id="container' + divCounter 
            + '"' +'style="height: 65%; min-width:45%">';
            + '</div>'+ '</div>' + '</div>'; 

      var graph = Highcharts.stockChart('container' + divCounter, {
        
        rangeSelector: {
            selected: 1
        },

        title: {
            text: ' Historical Stock Price'
        },

        series: [{
            name: 'idk',
            data: Arr2,
            tooltip: {
                valueDecimals: 2
            }
        }]
    }); 

    }
    divCounter++;
    console.log('graph');
    chatDiv.scrollTop = chatDiv.scrollHeight;    

});

