'use strict';

var Conversation = require('./conversation.js');

var dataFileForNow = 'sample.txt';

var pink = 'rgb(243, 38, 114)',
		purple = 'rgb(71, 3, 166)';

var w = 720,
		h = 3600,
		hFactor = 1,
		maxChar = 5000,
		rW = 4;

var datetimeFormat = d3.time.format("%-m/%-d/%-y, %-H:%M %p"),
		dayFormat = d3.time.format("%Y-%m-%d");

module.exports = {
	init: function () {

	},
	render: function () {
		d3.text(dataFileForNow, function (data) {

			var Convo = new Conversation(data);
			var messages = Convo.getMessages();

			var paloma = [],
					palomaDay = {};

			var franc = [],
					francDay = {};

			// Separate data objects for paloma and Franc
			// and bundle them by day
			messages.forEach(function (message) {
				var day = message.datetime;
				var author = message.author;

				if (author == Convo.authorA) {
					if (!(day in francDay)) {
						francDay[day] = [];
					}
					francDay[day].push(message);
				} else {
					if (!(day in palomaDay)) {
						palomaDay[day] = [];
					}
					palomaDay[day].push(message);
				}
			});

			// Array of days
			var dateRange = Convo.getDateRange();

			for (var day in dateRange) {
				var date = dateRange[day];
				var dayString = dayFormat(date)

				if (dayString in francDay) {
					franc.push(francDay[dayString]);
				} else {
					franc.push([{
						author: Convo.authorA,
						datetime: dayString,
						text: ''
					}]);
				}

				if (dayString in palomaDay) {
					paloma.push(palomaDay[dayString]);
				} else {
					paloma.push([{
						author: Convo.authorB,
						datetime: dayString,
						text: ''
					}]);
				}
			}

			d3.select('#graph svg').remove();

			var svg = d3.select('#graph').append('svg')
									.attr('width', w)
									.attr('height', h);

			var timeScale = d3.time.scale()
												.domain([Convo.date0, Convo.dateF])
												.range([0, h]);

			var charScale = d3.scale.linear()
												.domain([0, maxChar])
												.range([w/2, 0]);

			function getCharacters(day) {
					if (day) {
						var numChar = 0;
						day.forEach(function (message) {
							numChar += message.text.length;
						});
						return numChar;
					}
			}

			var lineFunction = d3.svg.area()
				.y(function(d) { return timeScale(dayFormat.parse(d[0].datetime)); })
				.x0(function(d) { return charScale(getCharacters(d)); })
				.x1(function(d) { return charScale(0); })
				.interpolate("basis");

			var lineFunction2 = d3.svg.area()
				.y(function(d) { return timeScale(dayFormat.parse(d[0].datetime)); })
				.x0(function(d) { return charScale(-getCharacters(d)) - 5; })
				.x1(function(d) { return charScale(0); })
				.interpolate("basis");

			var palomaLine = svg.append("path")
				.attr("d", lineFunction(paloma))
				.attr("stroke", pink)
				.attr("stroke-width", 0)
				.attr("fill", pink);

			var francLine = svg.append("path")
				.attr("d", lineFunction2(franc))
				.attr("stroke", pink)
				.attr("stroke-width", 0)
				.attr("fill", pink);

		});
	}
}
