var request = require('request');
var yahooFinance = require('yahoo-finance');


class Info {

    getCurrentInfo(companyTicker) {
        return new Promise((resolve, reject) => {
          
            yahooFinance.quote({
                symbol: companyTicker,
                modules: ['price', 'summaryDetail']
            }, function(err, quote) {
                if(err){
                    console.log(err)
                    resolve(err);
                } else {
                    var marketPrice = quote.price.regularMarketPrice;
                    var marketChange = quote.price.regularMarketChangePercent;
                    var yearHigh = quote.summaryDetail.fiftyTwoWeekHigh;
                    var yearLow = quote.summaryDetail.fiftyTwoWeekLow;
                    var marketCap = quote.summaryDetail.marketCap;
                    if (marketCap != undefined) {
                        marketCap = marketCap.toLocaleString(undefined,{
                            minimumFractionDigits: 2
                        });
                    }
                    marketChange = (marketChange*100).toFixed(2);
                    resolve(" The price of " + companyTicker + " is: $" 
                    + marketPrice + ". The percent change for the day is: " + 
                    marketChange + "%. " +  " The market cap is: $" + 
                    marketCap +". " + " The year high price is: $" + yearHigh 
                    + "." + " The year low price is: $" + yearLow + "." );
                }
            });
        });
    }

    getChart(companyTicker) {

        return new Promise((resolve, reject) => {

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            
            var today = year + "-" + month + "-" + day;
            console.log('newDate: ')
            console.log(today);


            yahooFinance.historical({
                symbol: companyTicker,
                from: '2010-10-28',
                to: today,
                period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
              }, function (err, quotes) {
                //   console.log('quotes')
                //   console.log(quotes)
                console.log('about to resolve quotes')
                console.log(quotes.length)
                var i = 0;
                for (i = 0; i < quotes.length; i++) {
                    if(quotes[i].date != undefined) {
                        quotes[i].date = quotes[i].date.getTime()  
                    }
                }
                // console.log(quotes)
                  resolve(quotes)
                //...
              });
              
          });

        

    }
    
}

module.exports = Info;