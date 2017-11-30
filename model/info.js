var request = require('request');
var yahooFinance = require('yahoo-finance');


class Info {

    getCurrentInfo(companyTicker) {
        return new Promise((resolve, reject) => {

            console.log(companyTicker)
            var cloudQuoteUrl = "http://api.cloudquote.net/fcon/getStockPrice.json?symbol="
             +companyTicker +"&T=i9n6elr3s55ayeusjme3r3sor";
            var findCompany = {
                url: cloudQuoteUrl,
                method: 'GET'
              };
              console.log('findCompany')
              console.log(findCompany)
              
            
            request.get(findCompany, function(err, body,req){
                
                console.log('body')
                if (err) {
                    console.log(err)
                    resolve(err);
                } else {
                    var priceObj = JSON.parse(req)
                    // console.log(priceObj.rows[0].Ask)
                    console.log(priceObj)

                    Number.prototype.after = function () {
                        var value = parseInt(this.toString().split(".")[1], 10);//after
                        return value ? value : 0;
                    }
                    
                    var price = priceObj.rows[0].Price;
                    var before = Math.floor(price)
                    var aft = price.after();
                    var yearLow = priceObj.rows[0].LowYTD;
                    var yearHigh = priceObj.rows[0].HighYTD;
                    var name = priceObj.rows[0].Name;
                    var marketChangePercent = priceObj.rows[0].ChangePercent.toFixed(2);
                    var marketChangePoint = priceObj.rows[0].Change.toFixed(2);
                    if (marketChangePoint > 0) {
                        marketChangePoint = '+' + marketChangePoint;
                        console.log('marketChangePercent')                         
                        console.log(marketChangePoint) 
                    }
                    
                    resolve('<center><p id="ticker">' + companyTicker + '<br>' + 
                        '<span>' + name +'</span>' + '<br>'+ '<br>' +  ' $'+
                        '<span id="before">' + before + '</span>' + '.' + aft+   
                        '<br>' +'<span id="today">' + marketChangePoint +
                        '(' + marketChangePercent + '%)' + ' TODAY' + '</span>' + '</p></center>');
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

            var cloudQuoteUrl = "http://api.cloudquote.net/fcon/getStockPriceHistory.json?symbol="
            +companyTicker +"&T=i9n6elr3s55ayeusjme3r3sor&from=2010-01-01&to=" + today;
            var getPriceHistory = {
                url: cloudQuoteUrl,
                method: 'GET'
            };

            // request.get(getPriceHistory, function(err, body,req){
            //     var histObj = JSON.parse(req)
            //     // console.log(priceObj.rows[0].Ask)
            //     var length = histObj.rows.length;
            //     var something;

            //     var i = 0;
            //     var k = 0;
            //     var Arr1 = [];
            //     var Arr2 = [];

   
            //     var j = histObj.rows[i][0].length;
            //     for(var i = 0; i < length; i++){
            //         Arr1 = [];
            //         Arr1[k] = histObj.rows[i][0];               
            //         Arr1[k+1] = histObj.rows[i][4];    
  
            //         Arr2[i] = Arr1;
            //         console.log('Arr2')
            //         console.log(Arr2[0])
            //         j--;
                    
            //     }
            //     console.log('arr2: ')
            //     console.log(Arr2)
            //     resolve(Arr2)
                
            // });
            




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
                console.log('quotes: ')
                console.log(quotes)
                  resolve(quotes)
                //...
              });
              
          });

        

    }
    
}

module.exports = Info;
