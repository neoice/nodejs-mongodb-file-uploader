var http = require('http');

/* user request
var options = {
	host: 'localhost',
	port: 3002,
	path: '/user/find/neoice@neoice.net',
	method: 'GET',
};

var soa_req = http.request(options, function(soa_res) {
        console.log('STATUS: ' + soa_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(soa_res.headers));
        //soa_res.setEncoding('utf8');

	soa_res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});

});

soa_req.end();
*/

var options = {
	host: 'localhost',
	port: 3002,
	path: '/file/import/',
	method: 'POST',
};

var soa_req = http.request(options, function(soa_res) {
        console.log('STATUS: ' + soa_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(soa_res.headers));
        //soa_res.setEncoding('utf8');

	soa_res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});

});

soa_req.write('/tmp/testfile');
