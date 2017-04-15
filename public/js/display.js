
var host = document.location.origin;
var socket = io.connect(host);

socket.on('connect', function (data) {
    socket.emit('main');
});

// React to annyang commands on remote
socket.on('controlling', function (data) {
    var command = data.command, 
        element = data.element, 
        action = data.action,
        query = data.query;

    if (command === 'show') {
        if (element === 'weather') {        
            $('#top-left').css('visibility','visible');
        } else if (element === 'time') {
            $('#top-right').css('visibility','visible');
        } else if (element === 'news') {
            $('#bottom-right').css('visibility','visible');
        } else if (element === 'youtube') {
            $('#bottom-left').css('visibility','visible');
        } else if (element === 'description') {
            Rss.description = true;
            Rss.refresh(Rss.description);
        } else if (element === 'all') {
            $('#top-left').show();
            $('#top-right').show();
            $('#bottom-right').show();
            $('#bottom-left').show();
        }
    } else if (command === 'hide' || command === 'hyde') {
        if (element === 'weather') {
            $('#top-left').css('visibility','hidden');
        } else if (element === 'time') {
            $('#top-right').css('visibility','hidden');
        } else if (element === 'news') {
            $('#bottom-right').css('visibility','hidden');
        } else if (element === 'youtube') {
            $('#bottom-left').css('visibility','hidden');
        } else if (element === 'description') {
            Rss.description = false;
            Rss.refresh(Rss.description);
        } else if (element === 'all') {
            $('#top-left').hide();
            $('#top-right').hide();
            $('#bottom-right').hide();
            $('#bottom-left').hide();
        }
    } else if (command === 'youtube') {
        if (action === 'search') {
            Youtube.query = query;
            Youtube.getRequest();
        } else if (action === 'play') {
            Youtube.play(query);
        } else if (action === 'stop' || action === 'stomp' || action === 'stock') {
            Youtube.stop();
        }
    } else if (command === 'play') {
        Youtube.playFirst(element);
    } else if (command === 'stop' || command === 'stomp' || command === 'stock') {
        Youtube.stop();
    } else {
        socket.emit('unrecognized');
        console.log('unrecognized command!');
    }
});