
var host = document.location.origin;
var socket = io.connect(host);

socket.on('connect', function(data){
	// Tell the server that you are the remote
	socket.emit('remote');

	if (annyang) {
		// Let's define a command.
		var commands = {
			'youtube :action (*query)': function (action, query) {
				if (action === 'play' || action === 'search') {
					$('#yt').html(query);
					$('#yt').addClass('input');

					if (action === 'play') {
						$('#play').addClass('input');						
					} else {
						$('#search').addClass('input');
					}
					setTimeout(function () {
						$('#yt').html('_________');
						$('#yt').removeClass('input');
						$('#play').removeClass('input');
						$('#search').removeClass('input');
					}, 3000);
				}

				if (query) {
					socket.emit('control', { 
						command: 'youtube', 
						action: action.toLowerCase(), 
						query: query.trim().toLowerCase()
					});
				} else {
					socket.emit('control', { 
						command: 'youtube', 
						action: action.toLowerCase()
					});
				}
			},
			':command (the) *element': function (command, element) {
				if (command === 'show' || command === 'hide' || command === 'hyde') {
					$('#show-hide').html(element);
					$('#show-hide').addClass('input');
					
					if (command === 'show') {
						$('#show').addClass('input');
					} else {
						$('#hide').addClass('input');
					}

					setTimeout(function () {
						$('#show-hide').html('_________');
						$('#show-hide').removeClass('input');
						$('#show').removeClass('input');
						$('#hide').removeClass('input');
					}, 3000);
				} else if (command === 'play') {
					$('#play-query').html(element);
					$('#play-query').addClass('input');

					setTimeout(function () {
						$('#play-query').html('_________');
						$('#play-query').removeClass('input');
					}, 3000);
				} else if (command === 'stop' || command === 'stock' || command === 'stomp') {
					$('#stop').addClass('input');
					
					setTimeout(function () {
						$('#stop').removeClass('input');
					}, 3000);
				}

				socket.emit('control', { 
					command: command.toLowerCase(), 
					element: element.toLowerCase()
				});
			}
		};

		// Add our commands to annyang
		annyang.addCommands(commands);
		// Debug mode on
		annyang.debug();
		// Start listening.
		annyang.start();
	} else {
		$('#commands').html('Browser is not supported.');
	}
});

socket.on('unrecognizedCommand', function () {
	$('#error').css('visibility', 'visible');
	$('#error').html('Unrecognized command.');
	
	setTimeout(function() {
		$('#error').css('visibility', 'hidden');
	}, 2500);
});

$(document).ready(function() {
	$('#commands').hide();
	$('#welcome').fadeIn(500);
	
	setTimeout(function() {
		$('#welcome').hide();
	}, 1500);

	setTimeout(function() {
		$('#commands').fadeIn(1000);
	}, 1200);
});