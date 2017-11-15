var request = require('request');

class Company {

    findCompany(userInput) {
        return new Promise((resolve, reject) => {
            console.log(userInput)
            var findCompany = {
                url: "http://d.yimg.com/aq/autoc?query=" + userInput + "&region=US&lang=en-US",
                method: 'GET'
              };
              console.log('findCompany')
              console.log(findCompany)
              
            
            request.get(findCompany, function(err, body,req){
                let json = JSON.parse(body.body)
                // console.log('body')
                // console.log(body)
                if (json.ResultSet.Result[0] === undefined){
                    resolve('Sorry, we could not find your company. Try again.')          
                } else {
                    console.log(json.ResultSet.Result[0].symbol);
                    resolve(json.ResultSet.Result[0].symbol)
                }
            });
        });
    }       
}

module.exports = Company;