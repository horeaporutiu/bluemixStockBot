var request = require('request');
var Company = require('./company.js')
var Info = require('./info.js')

class Watson {

    talkToWatson(userInput, getChart) {

        return new Promise((resolve, reject) => {

            console.log('userInput')
            console.log(userInput)

            console.log('getChart: ')
            console.log(getChart)
            
            if (!userInput) {
                resolve('Please type a company name or stock ticker.');
            }
      
        // Replace with the context obtained from the initial request
            var context = {};

            console.log('before request post')

            //params for HTTP call to Watson Conversation
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
                let company = new Company();
                let info = new Info();
                if(!body.input) {
                    return response.json(body)
                }
                console.log('body: ')
                console.log(body)

                if (body.input === undefined) {
                    resolve('error')
                } else {
                    company.findCompany(body.input.text).then(function(stockTicker){
                        if (stockTicker.length > 7) {
                            resolve(stockTicker)
                        }
                        return stockTicker;
                    }).then(function(stockTicker){
                        console.log('HELLO!')
                        if (getChart) {
                            info.getChart(stockTicker).then(function(output){
                                console.log('about the get our return from getChart')
                                // console.log(output)
                                resolve(output)
                            });
                        }
                        else{
                            info.getCurrentInfo(stockTicker).then(function(output){
                                console.log('GET CURRENT INFO')
                                // console.log(output)
                                resolve(output)
                            });
                        }
                        
                        // resolve(info.getCurrentInfo(stockTicker))
                    }).catch(console.log.bind(console));
                }
                
            });
  
        });
    }
}

module.exports = Watson;
var data = {};
var searchError = 'Please try again, we could not find your company'
var transUrl = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate';
var convoUrl = 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/60f188c8-a8f7-4357-8225-072061ae18b7/message?version=2017-05-26'
