var request = require('request');
var Company = require('./company.js');
var Info = require('./info.js');
var watson = require('watson-developer-cloud');
var context = {};
var firstTime = true;
var newCompany = false;
var companyTicker = '';


class Watson {

  talkToWatson(userInput, getChart) {

    return new Promise((resolve, reject) => {
      console.log('new company')
      console.log(newCompany)

      if (!context.company) {
        let company = new Company();                
        context.company = userInput;
        company.findCompany(userInput).then(function(output){
          console.log(output);
          if(output.length > 25) {
            resolve('Sorry, we could not find your company. Try another one!');
          } else {
            companyTicker = output;
          }
        });
      } else if (newCompany) {
        context.company = userInput;
        newCompany = false;
      }
      var something = true;

      var conversation = watson.conversation( {
        url: 'https://gateway.watsonplatform.net/conversation/api',
        username: config.conversationUsername,
        password: config.conversationPassword,
        version_date: '2017-05-26',
        version: 'v1'
      } );
      
      if (!something) {
        console.log('inside No user input');
        resolve('Please type a company name or stock ticker.');
      } else {

        console.log('before request post')

        var options = {
          url: convoUrl,
          'method': 'POST',
          json: {
            'input': {
              'text' : userInput
            }
          }, 
          auth: {
            user: config.conversationUsername,
            pass: config.conversationPassword
          }
        };

        request(options,function(error,response,body){
          if(error){
              console.log(error);
          }
          let info = new Info();
          var payload = {
            workspace_id: "60f188c8-a8f7-4357-8225-072061ae18b7",
            context: context,
            input: response.body.input || {},
            ticker: companyTicker
          };
          conversation.message(payload, function(err, response) {
            if (err) {
              return response.status(err.code || 500).json(err);
            }
            context = response.context;
            resolve(updateMessage(payload, response));
          });
        });
      }
    });
  }
}

function updateMessage(input, response) {

  return new Promise((resolve, reject) => {
    var getChart = false;
    console.log('afterStockTicker')
    console.log(response)

    if (response.intents.length > 0) {
      var responseArr = []
      responseArr[0] = response.output.text[0]
      
      var info = new Info
      var company = new Company
      company.findCompany(response.context.company).then(function(output){
        
        console.log('response.output.text: ')
        console.log(response.output.text[0])
        if(output.length > 25) {
          resolve('Sorry, we could not find your company. Try another one!');
        }
        else if (response.intents[0].intent === 'both') {
          info.getChart(output).then(function(chartInfo){
            responseArr[2] = chartInfo;
          })
          .then(function(){
            info.getCurrentInfo(output).then(function(stockInfo){
              responseArr[1] = stockInfo;
              resolve(responseArr)
            })
          })
          // console.log('***********BOTH********')
          // info.getCurrentInfo(output).then(function(output){
          //   console.log(responseArr[0])
          //   console.log('getCurrentInfo output: ')
          //   console.log(output)
          //   responseArr[1] = output
          //   setTimeout(function(){ 
          //     info.getChart(output)
          //     .then(function(result){
          //       console.log('response from getChart: ')
          //       console.log(result)
          //       responseArr[2] = result
          //       resolve(responseArr)
          //     });          
          //    }, 1000);  
          //   console.log('both, responseArr: ')
          //   console.log(responseArr)
          //   // resolve(responseArr)          
          // }); 
        }
        else if (response.intents[0].intent === 'historical') {
          info.getChart(output).then(function(output){
            getChart = true;          
            responseArr[1] = getChart                    
            responseArr[2] = output
            // info.appendText();
            resolve(responseArr);
          });
        }
        else if (response.intents[0].intent === 'current') {
          console.log('*******************')
          info.getCurrentInfo(output).then(function(output){
            console.log(output)
            responseArr[1] = output
            resolve(responseArr)
          });
        }
        else if (response.output.text[0] === 'Great! What company would you like to learn about?') {
          context.company = response.input.text
          newCompany = true;
          console.log(' we are about to change the company name here')
          resolve(response.output.text)
        }
        else {
          console.log('in the else')
          console.log(response.output.text)
          resolve(response.output.text);        
        }
      })            
    
    } else {
        if (!response.output) {
          response.output = {};
          } else {
            console.log('about to resolve response.output.text')
          resolve(response.output.text);
        }
        resolve(response);
    }
  });
}

module.exports = Watson;
var data = {};
var searchError = 'Please try again, we could not find your company'
var transUrl = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate';
var convoUrl = 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/60f188c8-a8f7-4357-8225-072061ae18b7/message?version=2017-05-26'
var historical = false;


// else if (response.output.text[0] === 'Great! What company would you like to learn about?') {
//   context.company = response.input.text
//   newCompany = true;
//   console.log(' we are about to change the company name here')
//   resolve(response.output.text)
// }