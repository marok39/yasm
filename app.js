
var fs = require('fs');
var hskey = fs.readFileSync('cert/localhost-key.pem');
var hscert = fs.readFileSync('cert/localhost-cert.pem');

var options = {
	key: hskey,
	cert: hscert
}

var express = require('express'),
	app = express(),
	server = require('https').createServer(options, app),
	path = require('path'),
	io = require('socket.io').listen(server);

app.set('port', process.env.TEST_PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/remote', function (req, res) {
	res.sendFile(__dirname + '/public/remote.html');
});

server.listen(app.get('port'), function() {
	console.log('YASM running on port ' + app.get('port'));
});

var ss;
var remote;

io.sockets.on('connection', function (socket) {

	socket.on('main', function (data) {
		socket.type = 'main';
		ss = socket;
		console.log('YASM main ready.');
	});

	socket.on('remote', function (data) {
		socket.type = 'remote';
		remote = socket;
		console.log('YASM remote ready.');
	});

	socket.on('control', function (data) {
		if (ss && socket.type === 'remote') {
			ss.emit('controlling', { 
				command: data.command, 
				element: data.element, 
				action: data.action, 
				query: data.query
			});
		}
	});

	socket.on('unrecognized', function () {
		remote.emit('unrecognizedCommand');
	});
});
