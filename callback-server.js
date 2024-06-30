var app = require('http').createServer(function (request) {
	console.log(request.url);

});
app.listen(80);
