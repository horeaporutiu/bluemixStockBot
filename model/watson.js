var request = require('request');
var Company = require('./company.js')
var Info = require('./info.js')
var watson = require('watson-developer-cloud');
var context = {}


class Watson {

    talkToWatson(userInput, getChart) {

        return new Promise((resolve, reject) => {

            console.log('inside Talk to Watson');
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
                        console.log(error)
                    }
 
                    console.log('resp')
                    console.log(response.body);   
                    var convoId = response.body.context.conversation_id              
                    let company = new Company();
                    let info = new Info();
                 
                    var payload = {
                        workspace_id: "60f188c8-a8f7-4357-8225-072061ae18b7",
                        context: context,
                        input: response.body.input || {}
                    };
                    conversation.message(payload, function(err, response) {

                        if (err) {
                          return response.status(err.code || 500).json(err);
                        }
                        console.log('payload.context: ')
                        console.log(payload)
                        context = response.context;
                        console.log('payload.context: ')
                        console.log(payload)
                        resolve(updateMessage(payload, response));
                    });
                      console.log('body: ')
                      console.log(body)
                      console.log('bodyFinished*************')


    
                    // if (body.input === undefined) {
                    //     resolve('error')
                    // } else {
                    //     company.findCompany(body.input.text).then(function(stockTicker){
                    //     if (stockTicker.length > 7) {
                    //         resolve(stockTicker)
                    //     }
                    //     return stockTicker;
                    //     }).then(function(stockTicker){
                    //         console.log('HELLO!')
                    //         if (getChart) {
                    //             info.getChart(stockTicker).then(function(output){
                    //                 console.log('about the get our return from getChart')
                    //                 // console.log(output)
                    //                 resolve(output)
                    //             });
                    //         }
                    //         else{
                    //             info.getCurrentInfo(stockTicker).then(function(output){
                    //                 console.log('GET CURRENT INFO')
                    //                 // console.log(output)
                    //                 resolve(output)
                    //             });
                    //         }
                            
                    //         // resolve(info.getCurrentInfo(stockTicker))
                    //     }).catch(console.log.bind(console));
                    // }
                    
                });
            }
        });
    }


}

function updateMessage(input, response) {

    return new Promise((resolve, reject) => {

        // console.log(response);

        if (!response.output) {
            response.output = {};
          } else {
            resolve(response.output.text);
        }

        if (response.intents && response.intents[0]) {
            var intent = response.intents[0];

            // if (intent.confidence >= 0.75) {
            //   responseText = 'I understood your intent was ' + intent.intent;
            // } else if (intent.confidence >= 0.5) {
            //   responseText = 'I think your intent was ' + intent.intent;
            // } else {
            //   responseText = 'I did not understand your intent';
            // }
          }
        //   response.output.text = responseText;
          resolve(response);

    });
}

module.exports = Watson;
var data = {};
var searchError = 'Please try again, we could not find your company'
var transUrl = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate';
var convoUrl = 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/60f188c8-a8f7-4357-8225-072061ae18b7/message?version=2017-05-26'
var historical = false;
