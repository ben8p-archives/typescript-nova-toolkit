/**
 * Test Server
 */

var express = require('express');
var app = express();
var ROOT: string = './';

app.use(express.static(ROOT));

app.all('*', function(req: any, res: any){
	res.sendFile(req.params[0], {root: ROOT});
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Test are available here :');
	console.log('http://localhost:%s/node_modules/intern/client.html?config=tests/intern', port);
});
module.exports = server;
