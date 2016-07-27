/**
 * @file getStock.js
 * Handler for stock information.
 *
 */
var yahooFinance = require("yahoo-finance");

module.exports = function getStock(api, threadID, body) {
	var ticker = body.substring('@stock '.length).toUpperCase();
	yahooFinance.snapshot({
		symbol: ticker,
		fields: ['s', 'n', 'l1', 'd1', 'v', 's1', 'r', 'c1', 'p2']
	}, function(err, snapshot) {
		if (err) {
			console.log(err);
		} else if (snapshot.name != null) {
			var message = snapshot.name + ' (' + snapshot.symbol + ') last traded at $' + 
				snapshot.lastTradePriceOnly.toFixed(2) + ' on ' + snapshot.lastTradeDate + '.\n' +
				'Volume: ' + snapshot.volume + ' | P/E Ratio: ' + snapshot.peRatio + '\n' +
				'Change: $' + snapshot.change.toFixed(2) + ' | % Change: ' + (snapshot.changeInPercent * 100).toFixed(2) + '%';
				// TODO: toFixed() will throw error on null values, so check for this beforehand

			api.sendMessage(message, threadID);
			console.log('Stock info for ' + ticker + ' sent to ' + threadID);
		} else {
			// If no company name returned
			api.sendMessage('Stock ' + ticker + ' not found.' , threadID);
			console.log('No stock data found');
		}
	});
}