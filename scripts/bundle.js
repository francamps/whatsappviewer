(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// MAIN script

// Will require conversation.js, viewer.js
// var Viewer = require(viewer.js);
'use strict';

var Viewer = require('./viewer.js');

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender

    var authorA = document.querySelector('#authorA').value || 'AuthorA';
    var authorB = document.querySelector('#authorA').value || 'AuthorB';
    var text = document.querySelector('#text').value || '';

    var whatsapp = {
      authorA: authorA,
      authorB: authorB,
      text: text
    }

    Viewer.init(whatsapp);
    Viewer.render();
})

},{"./viewer.js":3}],2:[function(require,module,exports){
'use strict';

function Conversation (data) {
	this.datetimeFormat = d3.time.format("%-m/%-d/%-y, %-H:%M %p");
	this.dayFormat = d3.time.format("%Y-%m-%d");
	this.data = data.text || '';
	this.authors = {};

	this.parseTextData();

	this.calculateDateLimits();
}

Conversation.prototype = {
	getMessages: function () {
		return this.messages;
	},

	calculateDateLimits: function () {
    console.log(this)
		var datetime0 = this.messages[0].datetime;
		var datetimeF = this.messages[this.messages.length - 1].datetime;
		this.date0 = this.dayFormat.parse(datetime0);
		this.dateF = this.dayFormat.parse(datetimeF);
	},

	parseDateFormat: function (date) {
		var error = true;
		var formats = [
					d3.time.format("%-m/%-d/%-y, %-H:%M %p"),
					d3.time.format("%-m/%-d/%-Y, %-H:%M %p"),
					d3.time.format("%Y-%m-%d, %H:%M:%S"),
					d3.time.format("%b %d, %Y, %H:%M %p")
				],
				i = 0;

		while (i < formats.length || error === true) {
			try {
				if (formats[i].parse(date) !== null) {
					error = false;
					this.datetimeFormat = formats[i];
					break;
				}
				i++;
			} catch (e) {
				if (e instanceof TypeError) {
					i++;
				}
				console.log('Some other error');
			}
		}
	},

	parseAuthors: function () {
		this.authorA = Object.keys(this.authors)[0];
		this.authorA = Object.keys(this.authors)[1];
	},

	getDateRange: function () {
		return d3.time.day.range(this.date0, this.dateF);
	},

	parseTextData: function () {
		this.messages = [];

		// It is a new line if it contains time and author
		this.linesAuthored = this.data.split(' - ');
		var previousDate = this.linesAuthored[0];
		this.parseDateFormat(previousDate);

		for (var i = 0; i < this.linesAuthored.length; i++) {
			var allThisLine = this.linesAuthored[i],
					thisline = allThisLine.split('\n'),
					datetime = previousDate;

			previousDate = thisline[thisline.length - 1];
			var previousDateLen = previousDate.length;
			var messageMinusAuthor = allThisLine.substr(0, allThisLine.length - previousDateLen);

			var author = allThisLine.split(': ')[0],
					message = messageMinusAuthor.split(': ')[1];

			if (author && !(author in this.authors)) {
				this.authors[author] = true;
			}

			this.parseAuthors();

			// TODO: Catch all weird cases
			// Better parsing
			if (datetime && author && message) {
				this.messages.push({
					'datetime': this.dayFormat(this.datetimeFormat.parse(datetime)),
					'author': author,
					'text': message
				});
			}
		}
	},

	getConvFormat: function () {
		return this.datetimeFormat;
	}
	// Other possible functions
	// - Get all from one author
	// - Get everything from one day
	// - Get all authors
}

module.exports = Conversation;

},{}],3:[function(require,module,exports){
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
	init: function (whatsapp) {
		this.data = whatsapp;
	},
	render: function () {
			var Convo = new Conversation(this.data);
			var messages = Convo.getMessages();

			var authorA = [],
					authorAbyDay = {};

			var authorB = [],
					authorBbyDay = {};

			// Separate data objects for paloma and Franc
			// and bundle them by day
			messages.forEach(function (message) {
				var day = message.datetime;
				var author = message.author;

				if (author == Convo.authorA) {
					if (!(day in authorAbyDay)) {
						authorAbyDay[day] = [];
					}
					authorAbyDay[day].push(message);
				} else {
					if (!(day in authorBbyDay)) {
						authorBbyDay[day] = [];
					}
					authorBbyDay[day].push(message);
				}
			});

			// Array of days
			var dateRange = Convo.getDateRange();

			for (var day in dateRange) {
				var date = dateRange[day];
				var dayString = dayFormat(date)

				if (dayString in authorAbyDay) {
					authorA.push(authorAbyDay[dayString]);
				} else {
					authorA.push([{
						author: Convo.authorA,
						datetime: dayString,
						text: ''
					}]);
				}

				if (dayString in authorBbyDay) {
					authorB.push(authorBbyDay[dayString]);
				} else {
					authorB.push([{
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

			var lineA = svg.append("path")
				.attr("d", lineFunction(authorA))
				.attr("stroke", pink)
				.attr("stroke-width", 0)
				.attr("fill", pink);

			var lineB = svg.append("path")
				.attr("d", lineFunction2(authorB))
				.attr("stroke", pink)
				.attr("stroke-width", 0)
				.attr("fill", pink);
	}
}

},{"./conversation.js":2}]},{},[1]);
