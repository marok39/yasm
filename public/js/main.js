
var Clock = {
	days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	months : ["January","February","March","April","May","June","July","August","September","October","November","December"],
	
	appendZero: function (num) {
		if (num < 10) {
			return '0' + num;
		}

		return num;
	},

	refresh: function () {
		var date = new Date();
		$('#date').html(Clock.months[date.getMonth()] + ' ' + date.getDate());
		$('#day').html(Clock.days[date.getDay()]);
		$('#time').html(date.getHours() + ':' + Clock.appendZero(date.getMinutes()));
	},
	start: function () {
		if (Clock._running) {
			clearInterval(Clock._running);
		}

		Clock._running = setInterval(function () {
			Clock.refresh();
		}, 1000);

		Clock.refresh();
	}
}

var Weather = {
	location: 'Ljubljana, SI',

	refresh: function () {
		$.simpleWeather({
			location: Weather.location,
			woeid: '',
			unit: 'C', 
			success: function (weather) {
				temp = weather.temp + '&deg;';
				wcode = temp + '	<i id="weather-icon" class="weather-main icon-' + weather.code + '"></i>';
				$('#current-weather').html(wcode);
				$('#current-weather').append("<p class='weatherDescription'>"+weather.currently+"</p>");

				var html = '';
				for (var i = 0; i < 5; i++) {
					var day = '<td class="td-day">' + weather.forecast[i].day + '.</td>';
					var icon = '<td class="td-icon"><i class="icon-' + weather.forecast[i].code + '"></i></td>';
					var temps = '<td class="td-low-high">' + weather.forecast[i].low + '-' + weather.forecast[i].high + '&deg;</td>';

					html += '<tr>' + day + icon + temps + '</tr>';
				}
				$('#forecast').html(html);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},
	start: function () {
		if (Weather._running) {
			clearInterval(Weather._running);
		}

		Weather._running = setInterval(function () {
			Weather.refresh();
		}, 100000);

		Weather.refresh();
	}
}

var Rss = {
	description: false,

	refresh: function (description) {
		var url = 'http://www.rssmix.com/u/8207782/rss.xml';
    
		feednami.load(url, function (result) {
	        if (result.error) {
	            console.log(result.error);
	        } else {
	            var entries = result.feed.entries;
	            var html = '';
	            for(var i = 0; i < 10; i++){
	                var entry = entries[i];

	                if(description) 
	                	html += '<li><i class="small newspaper icon"></i>' + entry.title + '<div class="summary">' + entry.summary + '</div>' + '</li>';
	                else 
	                	html += '<li><i class="small newspaper icon"></i>' + entry.title + '</li>';
	            }
	            $('#rss-feed').html(html);
	        }
    	});
	},
	start: function () {
		if (Rss._running) {
			clearInterval(Rss._running);
		}

		Rss._running = setInterval(function () {
			Rss.refresh(Rss.description);
		}, 10000);

		Rss.refresh(Rss.description);
	}
}

var Youtube = {
	query: '',
	number_strings: ["one", "two", "free", "for", "five", "six", "seven", "eight", "nine", "ten"],
	results: [],

	showResults: function (results) {
		var html = '';
		var entries = results.items;

		$.each(entries, function (index, value) {
			var title = value.snippet.title;
			Youtube.results[index] = value.id.videoId;
			html += '<li><i class="small youtube play icon"></i> ' + (index+1) + ". "  + title + '</li>';
		});
		$('#results').html(html);
	},
	getRequest: function () {
		$('#results').show();
		$('#yt-frame').hide();

		url = 'https://www.googleapis.com/youtube/v3/search';
	    var params = {
	        part: 'snippet',
	        key: 'AIzaSyBASKGuUduCdsr7GklW6ZQSLlvv1E9FUzk',
	        type: 'video',
	        q: Youtube.query,
	        maxResults: 10
	    };
	  
	    $.getJSON(url, params, function (searchTerm) {
	        Youtube.showResults(searchTerm);
	    });
	},

	play: function (query) {
		$('#results').hide();
		$('#yt-frame').show();

		var query_split = query.split(' ');
		var index;

		// get the selected number from query string
		if (query_split[0] === 'number') {
			if (isNaN(query_split[1])) {
				index = Youtube.number_strings.indexOf(query_split[1]);
			} else {
				index = parseInt(query_split[1], 10) - 1;
			}
		} else {
			if (isNaN(query_split[0])) {
				index = Youtube.number_strings.indexOf(query_split[0]);
			} else {
				index = parseInt(query_split[0], 10) - 1;
			}
		}

		// check if we actually got something
		if (index > -1) {
			var id = Youtube.results[index];
			var html = '<iframe width=100% height=100% src="https://www.youtube.com/embed/' + id + '?autoplay=1&iv_load_policy=3" frameborder="0" allowFullScreen></iframe>';
			$('#yt-frame').html(html);
		}
	},
	playFirst: function (query) {
		$('#results').hide();
		$('#yt-frame').show();

		url = 'https://www.googleapis.com/youtube/v3/search';
	    var params = {
	        part: 'snippet',
	        key: 'AIzaSyBASKGuUduCdsr7GklW6ZQSLlvv1E9FUzk',
	        type: 'video',
	        q: query,
	        maxResults: 1
	    };
	  	
	  	$.getJSON(url, params, function (results) {
	  		var entries = results.items;

		    $.each(entries, function (index, value) {
				var id = value.id.videoId;
				if (id === value.id.videoId) {
					var html = '<iframe width=100% height=100% src="https://www.youtube.com/embed/' + id + '?autoplay=1&iv_load_policy=3" frameborder="0" allowFullScreen></iframe>';
					$('#yt-frame').html(html);
				}
			});
		});
	},
	stop: function () {
		$('#yt-frame').hide();
		$('#yt-frame').html('');
		$('#results').show();
	}
}

$(document).ready(function() {
	Clock.start();
	Weather.start();
	Rss.start();
});
