(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// MAIN script

// Will require conversation.js, viewer.js
'use strict';

var Viewer = require('./viewer.js');

document.querySelector("#add-conversation").addEventListener('click', function () {
  document.querySelector(".form-container").classList.toggle('hidden');
});

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender
    document.querySelector(".form-container").classList.add('hidden');

    var authorA = 'AuthorA';
    var authorB = 'AuthorB';
    var text = document.querySelector('#text').value || '';

    var whatsapp = {
      authorA: authorA || 'AuthorA',
      authorB: authorB || 'AuthorB',
      text: text
    }

    Viewer.init(whatsapp);
    Viewer.render();
});

},{"./viewer.js":3}],2:[function(require,module,exports){
'use strict';

function Conversation (data) {
	// Some initializing functions
	this.datetimeFormat = d3.time.format("%-m/%-d/%-y, %-H:%M %p");
	this.dayFormat = d3.time.format("%Y-%m-%d");
	this.data = data.text || '';
	this.authors = {};

	// Initial, neurtal parsing
	this.parseTextData();
}

Conversation.prototype = {
	getMessages: function () {
		return this.messages;
	},
	dateFormats: [
		/* 6/15/2009 */
		d3.time.format("%d/%m/%Y"),
		d3.time.format("%-d/%-m/%Y"),
		/* 15/06/2009 */
		d3.time.format("%m/%d/%Y"),
		d3.time.format("%-m/%-d/%Y"),
		/* 2009/06/15 */
		d3.time.format("%Y/%m/%d"),
		d3.time.format("%Y/%-m/%-d"),
		/* Monday, June 15, 2009 */
		d3.time.format("%b %d, %Y"),
		d3.time.format("%b, %d, %Y"),
		/* Monday, June 15, 2009 1:45 PM */
		d3.time.format("%b %d, %Y, %H:%M %p"),
		d3.time.format("%b, %d, %Y, %H:%M %p"),
		/* Monday, June 15, 2009 1:45:30 PM */
		d3.time.format("%b %d, %Y, %H:%M:%S %p"),
		d3.time.format("%b, %d, %Y, %H:%M:%S %p"),
		/* 6/15/2009 1:45 PM */
		d3.time.format("%-m/%-d/%-y, %-I:%M %p"),
		/* 15/06/2009 13:45 */
		d3.time.format("%-m/%-d/%-y, %H:%M"),
		/* 06/15/2009 13:45 */
		d3.time.format("%-d/%-m/%-y, %H:%M %p"),
		/* 2009/6/15 13:45 */
		d3.time.format("%Y/%-m/%-d, %H:%M"),
		/* 15/06/2009 13:45:30 */
		d3.time.format("%-d/%-m/%Y, %H:%M:%S"),
		/* 6/15/2009 1:45:30 PM */
		d3.time.format("%m/%-d/%Y, %I:%M:%S %p"),
		/* 2009/6/15 13:45:30 */
		d3.time.format("%Y/%m/%-d, %H:%M:%S"),
		/* 2009-06-15T13:45:30 */
		d3.time.format("%Y-%-m-%-dT%H:%M:%S"),
		/* 2009-06-15 13:45:30Z */
		d3.time.format("%Y-%-m-%-d %H:%M:%SZ"),
		/* Monday, June 15, 2009 8:45:30 PM */
		d3.time.format("%b, %m %d, %H:%M:%S %p"),
		/* */
		d3.time.format("%-m/%-d/%-y, %-H:%M %p"),
		d3.time.format("%-m/%-d/%-Y, %-H:%M %p"),
		d3.time.format("%Y-%m-%d, %H:%M:%S"),
		d3.time.format("%b %d, %Y, %H:%M %p")
	],

	calculateDateLimits: function () {
    var datetime0 = this.messages[0].datetime,
				datetimeF = this.messages[this.messages.length - 1].datetime;

		this.date0 = this.dayFormat.parse(datetime0);
		this.dateF = this.dayFormat.parse(datetimeF);
	},

	parseDateFormat: function (date) {
		var error = true;
		var formats = this.dateFormats,
				i = 0;

		while (i < formats.length && error === true) {
			try {
				if (formats[i].parse(date) !== null) {
					error = false;
					this.datetimeFormat = formats[i];
					console.log('what')
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
		return error;
	},

	parseAuthors: function () {
		this.authorAName = Object.keys(this.authors)[0];
		this.authorBName = Object.keys(this.authors)[1];
	},

	getDateRange: function () {
		return d3.time.day.range(this.date0, this.dateF);
	},

	parseErrorHandler: function () {
		window.alert('There was an error parsing the dates of your text. Sorry :/');
	},

	parseTextData: function () {
		this.messages = [];

		// It is a new line if it contains time and author
		this.linesAuthored = this.data.split(' - ');
		var previousDate = this.linesAuthored[0];
		var isError = this.parseDateFormat(previousDate);

		if (isError) {
			this.parseErrorHandler();
		} else {
			for (var i = 1; i < this.linesAuthored.length; i++) {
				var allThisLine = this.linesAuthored[i],
						thisline = allThisLine.split('\n'),
						datetime = previousDate;

				previousDate = thisline[thisline.length - 1];
				var previousDateLen = previousDate.length;
				var messageLen = allThisLine.length - previousDateLen;
				var messageMinusAuthor = allThisLine.substr(0, messageLen);

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
						'datetimeObj': this.datetimeFormat.parse(datetime),
						'author': author,
						'text': message
					});
				}
			}
			// Date limits
			this.calculateDateLimits();
		}
	},

	getConvFormat: function () {
		return this.datetimeFormat;
	},

	getMessagesByDay: function (day) {
		// Variable day needs to be of type date
		var messages = [];
		if (Object.prototype.toString.call(day) === "[object Date]") {
			var dayStr = this.dayFormat(day);
			for (var i = 0; i < this.messages.length; i++) {
				if (this.messages[i].datetime === dayStr) {
					messages.push(this.messages[i]);
				}
			}
			return messages;
		}
	},

	getMessagesByAuthorAndDay: function () {
		var messages = this.getMessages();

		var authorA = [],
				authorAbyDay = {};

		var authorB = [],
				authorBbyDay = {};

		// Separate data objects for authors
		// and bundle them by day
		var self = this;

		messages.forEach(function (message) {
			var day = message.datetime;
			var author = message.author;

			if (author === self.authorAName) {
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
		var dateRange = this.getDateRange();

		for (var day in dateRange) {
			var date = dateRange[day];
			var dayString = this.dayFormat(date)

			if (dayString in authorAbyDay) {
				authorA.push(authorAbyDay[dayString]);
			} else {
				authorA.push([{
					author: this.authorAName,
					datetime: dayString,
					text: ''
				}]);
			}

			if (dayString in authorBbyDay) {
				authorB.push(authorBbyDay[dayString]);
			} else {
				authorB.push([{
					author: this.authorBName,
					datetime: dayString,
					text: ''
				}]);
			}
		}

		return {
			authorA: authorA,
			authorB: authorB,
			authorAbyDay: authorAbyDay,
			authorBbyDay: authorBbyDay
		}
	},

	getMessageLengths: function () {
		var lengths = [];
		for (var i = 0; i < this.messages.length; i++) {
			if (this.messages[i].text.substr(0, 15) !== "<Media omitted>") {
				lengths.push(this.messages[i].text.length);
			}
		}
		return lengths;
	},

	getMedianMessageLen: function () {
		var lens = this.getMessageLengths();
		if (lens.length % 2 === 0) {
			var halfLen = Math.floor(lens/2);
			return (lens[halfLen - 1] + lens[halfLen + 1]) / 2;
		}
		return lens[Math.floor(lens.length / 2) + 1];
	},

	getNumberOfMessagesByAuthor: function () {
		var authorANum = 0,
				authorBNum = 1;
		for (var i = 0; i < this.messages.length; i++) {
			if (this.messages[i].author === this.authors[0]) {
				authorANum++;
			} else {
				authorBNum++;
			}
		}
	},

	getMessageTimes: function () {
		var timeformat = d3.time.format('%H');
		var authorA = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);
		var authorB = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);
		var messages = this.messages;

		for (var i = 0; i < messages.length; i++ ) {
			var hour = parseInt(timeformat(messages[i].datetimeObj));
			if (messages[i].author === this.authorAName) {
				authorA[hour] += 1;
			} else {
				authorB[hour] += 1;
			}
		}
		return {
			authorATimes: authorA,
			authorBTimes: authorB
		}
	},

	getResponseTimes: function () {
		var authorAresps = [],
				authorBresps = [];

		for (var i = 2; i < this.messages.length; i++) {
			var responder = this.messages[i].author,
					prompter = this.messages[i - 1].author;
			if (responder !== prompter) {
				var dateResp = this.messages[i].datetimeObj;
				var dateOrig = this.messages[i - 1].datetimeObj;
				var diff = Math.abs(dateResp.getTime() - dateOrig.getTime());
				if (responder === this.authorAName) {
					authorAresps.push(diff);
				} else {
					authorBresps.push(diff);
				}
			}
		}

		// Sort response times
		authorAresps.sort(function(a, b) {
		  return a - b;
		});
		authorBresps.sort(function(a, b) {
		  return a - b;
		});

		return {
			authorA: authorAresps,
			authorB: authorBresps
		};
	}
}

module.exports = Conversation;

},{}],3:[function(require,module,exports){
'use strict';

var Conversation = require('./conversation.js');

var pink = 'rgb(243, 38, 114)',
		purple = 'rgb(71, 3, 166)';

var w = (document.documentElement.clientWidth - 100) / 4,
		h = (document.documentElement.clientHeight - 100) / 4,
		smallH = 300,
		hFactor = 1,
		maxChar = 5000,
		rW = 4;

var dayFormat = d3.time.format("%Y-%m-%d");

module.exports = {
	init: function (whatsapp) {
		this.data = whatsapp;
		this.Convo = new Conversation(this.data);
		this.messages = this.Convo.getMessages();
		this.format();
	},

	format: function () {
		var messages = this.messages;
		var Convo = this.Convo;
		var messagesInfo = Convo.getMessagesByAuthorAndDay();

		this.authorA = messagesInfo.authorA;
		this.authorB = messagesInfo.authorB;
	},

	spectrogram: function () {
		var Convo = this.Convo;

		d3.select('#graph svg').remove();

		var svg = d3.select('#graph-viewer').append('svg')
								.attr('width', w * 4)
								.attr('height', h * 2);

		var timeScale = d3.time.scale()
											.domain([Convo.date0, Convo.dateF])
											.range([0, w * 4]);

		var charScale = d3.scale.linear()
											.domain([0, maxChar])
											.range([h, 0]);

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
			.x(function (d) { return timeScale(dayFormat.parse(d[0].datetime)); })
			.y0(function (d) { return charScale(getCharacters(d)); })
			.y1(function (d) { return charScale(0); })
			.interpolate("basis");

		var lineFunction2 = d3.svg.area()
			.x(function (d) { return timeScale(dayFormat.parse(d[0].datetime)); })
			.y0(function (d) { return charScale(-getCharacters(d)) - 5; })
			.y1(function (d) { return charScale(0); })
			.interpolate("basis");

		var lineA = svg.append("path")
			.attr("d", lineFunction(this.authorA))
			.attr("stroke", pink)
			.attr("stroke-width", 0)
			.attr("fill", pink);

		var lineB = svg.append("path")
			.attr("d", lineFunction2(this.authorB))
			.attr("stroke", pink)
			.attr("stroke-width", 0)
			.attr("fill", pink);
	},

	lengthHistogram: function () {
		var Convo = this.Convo;

		d3.select('#widget-1 svg').remove();

		var svg = d3.select('#widget-1').append('svg')
								.attr('width', w)
								.attr('height', smallH);

		var lengths = Convo.getMessageLengths();

		var xScale = d3.scale.linear()
							    .domain([0, 100])
							    .range([0, w]);

		var data = d3.layout.histogram()
    						.bins(xScale.ticks(10))(lengths);

		var yScale = d3.scale.linear()
		    .domain([0, d3.max(data, function(d) { return d.y; })])
		    .range([smallH - 20, 20]);

				var bar = svg.selectAll(".bar")
				    .data(data)
				  .enter().append("g")
				    .attr("class", "bar")
				    .attr("transform", function(d) {
							return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
						});

				bar.append("rect")
				    .attr("x", 0)
				    .attr("width", xScale(data[0].dx) - 2)
				    .attr("height", function(d) { return (smallH - 20) - yScale(d.y); })
						.style("fill", pink)
						.style("border-radius", "3px");
	},

	responseTimes() {
		var resps = this.Convo.getResponseTimes();
		console.log(resps,
			resps.authorA[Math.floor(resps.authorA.length/2)],
			resps.authorB[Math.floor(resps.authorB.length/2)]);

			var quartiles = d3.scale.quantile()
				.range([0, 1, 2, 3, 4, 5]);

		console.log(quartiles.domain(resps.authorA).quantiles());
		console.log(quartiles.domain(resps.authorB).quantiles());


		d3.select('#widget-2 svg').remove();

		var svg = d3.select('#widge2-1').append('svg')
								.attr('width', w)
								.attr('height', smallH);

		var xScale = d3.scale.linear()
							    .domain([0, 180000])
							    .range([0, w]);

		var data = d3.layout.histogram()
    						.bins(xScale.ticks(10))(resps.authorA);

		var yScale = d3.scale.linear()
		    .domain([0, d3.max(data, function(d) { return d.y; })])
		    .range([smallH - 20, 20]);

				var bar = svg.selectAll(".bar")
				    .data(data)
				  .enter().append("g")
				    .attr("class", "bar")
				    .attr("transform", function(d) {
							return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
						});

				bar.append("rect")
				    .attr("x", 0)
				    .attr("width", xScale(data[0].dx) - 2)
				    .attr("height", function(d) { return (smallH - 20) - yScale(d.y); })
						.style("fill", pink)
						.style("border-radius", "3px");

	},

	timeofDay: function () {
		var messageTimes = this.Convo.getMessageTimes();

		d3.select('#widget-3 svg').remove();

		var svg = d3.select('#widget-3').append('svg')
								.attr('width', w * 4)
								.attr('height', h);

		var xScale = d3.scale.linear()
									.domain([0, 24])
									.range([0, w * 4]);

		var rScale = d3.scale.pow().exponent(.5)
									.domain([0, d3.max(messageTimes.authorATimes)])
									.range([0, (w * 4) / 25]);

		var cScale = d3.scale.pow().exponent(.5)
									.domain([0, d3.max(messageTimes.authorBTimes)])
									.range([.2, .6]);

		var bubbleA = svg.selectAll(".bubbleA")
				.data(messageTimes.authorATimes)
				.enter().append("g")
				.attr("class", "bubbleA bubble")
				.attr("transform", function(d, i) {
					return "translate(" + xScale(i) + ",0)";
				});

		bubbleA.append("circle")
			.attr("r", function (d) { return rScale(d); })
			.attr("cx", 0)
			.attr("cy", 30)
			.style("fill", function (d) { return d3.hsl(338, .95, cScale(d)).toString(); });

		var bubbleB = svg.selectAll(".bubbleB")
			.data(messageTimes.authorBTimes)
			.enter().append("g")
			.attr("class", "bubbleB bubble")
			.attr("transform", function(d, i) {
				return "translate(" + xScale(i) + ", 100)";
			});

		bubbleB.append("circle")
			.attr("r", function (d) { return rScale(d); })
			.attr("cx", 0)
			.attr("cy", 30)
			.style("fill", function (d) { return d3.hsl(338, .95, cScale(d)).toString(); })
			.style("stroke-width", 1)
			.style("opacity", .85)
			.style("stroke", "#fff");
	},

	render: function () {
		this.spectrogram();
		this.lengthHistogram();
		this.responseTimes();
		this.timeofDay();
	}
}

},{"./conversation.js":2}]},{},[1]);
