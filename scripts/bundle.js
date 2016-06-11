(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// MAIN script

// Will require conversation.js, viewer.js
'use strict';

var Viewer = require('./viewer.js');

/*document.querySelector("#add-conversation").addEventListener('click', function () {
  document.querySelector(".form-container").classList.toggle('hidden');
});*/

document.querySelector("#render-button").addEventListener('click', function () {
    // This will trigger a rerender
    document.querySelector(".form-container").classList.add('hidden');
    document.querySelector(".canvas").classList.remove('hidden');
    window.setTimeout(function () {
      document.querySelector(".form-container").classList.add('removed');
    }, 1000);

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
		return d3.time.day.range(this.date0, d3.time.day.offset(this.dateF, 1));
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

	getCharactersByAuthorAndDay: function () {
		var messages = this.getMessagesByAuthorAndDay();

		var charsDayA = [],
				charsDayB = [];

		function getCharacters(day) {
			var numChar = 0;
			day.forEach(function (message) {
				numChar += message.text.length;
			});
			return {
				chars: numChar,
				datetime: day[0].datetime
			}
		}

		messages.authorA.forEach(function (day) {
			charsDayA.push(getCharacters(day));
		});
		messages.authorB.forEach(function (day) {
			charsDayB.push(getCharacters(day));
		});
		return {
			authorA: charsDayA,
			authorB: charsDayB
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

	getMessageWordCount: function () {
		var countsA = [],
				countsB = [];
		for (var i = 0; i < this.messages.length; i++) {
			var msg = this.messages[i]
			if (msg.text.substr(0, 15) !== "<Media omitted>") {
				if (msg.author === this.authorAName) {
					countsA.push(msg.text.split(' ').length);
				} else {
					countsB.push(msg.text.split(' ').length);
				}
			}
		}
		// Sort response times
		countsA.sort(function(a, b) {
		  return a - b;
		});
		countsB.sort(function(a, b) {
		  return a - b;
		});

		return {
			authorA: countsA,
			authorB: countsB
		};
	},

	getMessageWordCountAverage: function () {
		var counts = this.getMessageWordCount();
		var avgA = 0,
				avgB = 0;
		counts.authorA.forEach(function (d) {
			avgA += d;
		});
		counts.authorB.forEach(function (d) {
			avgB += d;
		});
		return {
			authorA: avgA / counts.authorA.length,
			authorB: avgB / counts.authorB.length
		};
	},

	getMessageWordCountMedian: function () {
		var counts = this.getMessageWordCount();
		return {
			authorA: counts.authorA[Math.floor(counts.authorA.length/2)],
			authorB: counts.authorB[Math.floor(counts.authorB.length/2)]
		};
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
		var authorA = _.filter(this.messages, { author: this.authorAName }),
				authorB = _.filter(this.messages, { author: this.authorBName });

		return {
			authorA: authorA.length,
			authorB: authorB.length
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
				} else if (responder === this.authorBName){
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
	},

	getResponseTimesByAuthorDay: function () {
		var authorAresps = {},
				authorBresps = {};

		for (var i = 2; i < this.messages.length; i++) {
			var responder = this.messages[i].author,
					prompter = this.messages[i - 1].author;

			var dayString = this.dayFormat(this.messages[i].datetimeObj);

			if (responder !== prompter) {
				var dateResp = this.messages[i].datetimeObj;
				var dateOrig = this.messages[i - 1].datetimeObj;

				var diff = Math.abs(dateResp.getTime() - dateOrig.getTime());

				if (diff < 60000 * 60 * 24) {
					if (responder === this.authorAName) {
						if (!(dayString in authorAresps)) {
							authorAresps[dayString] = [];
						}
						authorAresps[dayString].push(diff);
					} else if (responder === this.authorBName){
						if (!(dayString in authorBresps)) {
							authorBresps[dayString] = [];
						}
						authorBresps[dayString].push(diff);
					}
				}
			}
		}

		function reduceResponseTimesPerDay(d, dayString) {
			return {
				responseTime: d.reduce(function(m, n) { return m + n; }) / d.length,
				datetime: dayString
			}
		}

		var authorArespsAvg = _.map(authorAresps, reduceResponseTimesPerDay);
		var authorBrespsAvg = _.map(authorBresps, reduceResponseTimesPerDay);

		return {
			authorA: authorArespsAvg,
			authorB: authorBrespsAvg
		};

	}
}

module.exports = Conversation;

},{}],3:[function(require,module,exports){
'use strict';

var Conversation = require('./conversation.js');

var pink = 'rgb(243, 38, 114)',
		purple = 'rgb(71, 3, 166)';

var w = document.querySelector(".page-wrap").offsetWidth - 40,
		h = 400;

var dayFormat = d3.time.format("%Y-%m-%d"),
		labelFormat = d3.time.format("%b %d '%y");

module.exports = {
	init: function (whatsapp) {
		this.data = whatsapp;
		this.Convo = new Conversation(this.data);
		this.messages = this.Convo.getMessages();
	},

	spectrogram: function () {
		var chars = this.Convo.getCharactersByAuthorAndDay();

		d3.select('#graph-viewer svg').remove();

		var svg = d3.select('#graph-viewer')
								.append('svg')
								.attr('width', w)
								.attr('height', h);

		var timeScale = d3.time.scale()
											.domain([this.Convo.date0, this.Convo.dateF])
											.range([0, w]);

		var allChars = chars.authorA.concat(chars.authorB);
		var maxChar = d3.max(allChars, function (d) {
			return d.chars;
		});

		var charScale = d3.scale.linear()
											.domain([0, maxChar])
											.range([h/2, 0]);

		var lineFunction = d3.svg.area()
			.x(function (d) { return timeScale(dayFormat.parse(d.datetime)); })
			.y0(function (d) { return charScale(d.chars); })
			.y1(function (d) { return charScale(0); })
			.interpolate("basis");

		var lineFunction2 = d3.svg.area()
			.x(function (d) { return timeScale(dayFormat.parse(d.datetime)); })
			.y0(function (d) { return charScale(-d.chars); })
			.y1(function (d) { return charScale(0); })
			.interpolate("basis");

		var lineA = svg.append("path")
			.attr("d", lineFunction(chars.authorA))
			.attr("fill", pink);

		var lineB = svg.append("path")
			.attr("d", lineFunction2(chars.authorB))
			.attr("fill", purple);

		// To highlight messages later on
		this.spectrogram = {
			svg: svg,
			timeScale: timeScale,
			charScale: charScale
		}

		svg.append("text")
			.attr("class", "time-label")
			.attr("x", 0)
			.attr("y", h/4)
			.text(labelFormat(this.Convo.date0));

		svg.append("text")
			.attr("class", "time-label")
			.attr("x", timeScale(this.Convo.dateF))
			.attr("y", h/4)
			.style("text-anchor", "end")
			.text(labelFormat(this.Convo.dateF));
	},

	authorsLegend: function (svg) {
		document.querySelector("#author-A-col").style.background = pink;
		document.querySelector("#author-B-col").style.background = purple;
		document.querySelector("#author-A-leg-label").innerHTML = this.Convo.authorAName;
		document.querySelector("#author-B-leg-label").innerHTML = this.Convo.authorBName;
	},

	// Flag days where those messages are sent
	displaySomeMessages: function (messages) {
		var svg = this.spectrogram.svg,
				timeScale = this.spectrogram.timeScale,
				charScale = this.spectrogram.charScale;

		if (svg) {
			svg.selectAll('.selected-msg').remove();
			svg.selectAll('.selected-msg')
				.data(messages)
				.enter().append('circle')
				.attr('class', 'selected-msg')
				.attr('cx', function (d) {
					return timeScale(dayFormat.parse(d.datetime)); })
				.attr('cy', 10)
				.attr('r', 5)
				.style('fill', purple);
		}
	},

	responseTimes() {
		var resps = this.Convo.getResponseTimes();
		var respsDay = this.Convo.getResponseTimesByAuthorDay();

		d3.select('#widget-3 svg').remove();

		var h = 140;

		var svg = d3.select('#widget-3').append('svg')
								.attr('width', w)
								.attr('height', h);

		var timeScale = d3.time.scale()
											.domain([d3.time.day.offset(this.Convo.date0, 1), this.Convo.dateF])
											.range([0, w]);

		var yScale = d3.scale.linear()
											.domain([0, 100000000])
											.range([100, 0]);

		var linefunction = d3.svg.line()
		    .x(function(d) {
					return timeScale(dayFormat.parse(d.datetime));
				})
		    .y(function(d) {
					return yScale(d.responseTime);
				})
				.interpolate("step-before");

		svg.append("path")
		      .datum(respsDay.authorA)
		      .attr("class", "lineA respLine")
		      .attr("d", linefunction)
					.style("stroke", pink);

		svg.append("path")
		      .datum(respsDay.authorB)
		      .attr("class", "lineB respLine")
		      .attr("d", linefunction)
					.style("stroke", purple)

		d3.selectAll(".respLine")
					.style("fill", "none")
					.style("stroke-width", "2px");

		svg.append("text")
			.attr("class", "time-label")
			.attr("x", 0)
			.attr("y", h/4)
			.text(labelFormat(this.Convo.date0));

		svg.append("text")
			.attr("class", "time-label")
			.attr("x", timeScale(this.Convo.dateF))
			.attr("y", h/4)
			.style("text-anchor", "end")
			.text(labelFormat(this.Convo.dateF));

	},

	timeofDay: function () {
		var messageTimes = this.Convo.getMessageTimes();

		d3.select('#widget-2 svg').remove();

		var svg = d3.select('#widget-2').append('svg')
								.attr('width', w)
								.attr('height', 140);

		var r = 20;

		var maxA = d3.max(messageTimes.authorATimes),
				maxB = d3.max(messageTimes.authorBTimes);

		var rScale = d3.scale.pow().exponent(.5)
									.domain([0, maxA])
									.range([1, 15]);

		var cScale = d3.scale.pow().exponent(.5)
									.domain([0, maxB])
									.range([.2, .6]);

		var bubbleA = svg.selectAll(".bubbleA")
				.data(messageTimes.authorATimes)
				.enter().append("g")
				.attr("class", "bubbleA bubble")
				.attr("transform", function(d, i) {
					return "translate(" + (20 + i * 30) + "," + (35) + ")";
				});

		bubbleA.append("circle")
			.attr("r", function (d) { return rScale(d); })
			.attr("cx", 0)
			.attr("cy", 0)
			.style("fill", function (d) {
				return d3.hsl(338, .95, cScale(d)).toString();
			});

		var bubbleB = svg.selectAll(".bubbleB")
			.data(messageTimes.authorBTimes)
			.enter().append("g")
			.attr("class", "bubbleB bubble")
			.attr("transform", function(d, i) {
				return "translate(" + (20 + i * 30) + "," + (85) + ")";
			});

		bubbleB.append("circle")
			.attr("r", function (d) { return rScale(d); })
			.attr("cx", 0)
			.attr("cy", 0)
			.style("fill", function (d) {
				return d3.hsl(265, .97, cScale(d)).toString();
			});

		svg.selectAll(".time-labels")
			.data(new Array(24))
			.enter().append("text")
			.attr("class", "time-label")
			.attr("x", function (d, i) { return 20 + i * 30; })
			.attr("y", 65)
			.style("text-anchor", "middle")
			.text(function (d, i) { return i + "h"; })
	},

	/*
	*
	* Get data from conversation and fill table
	*
	*/

	fillDataTable: function () {
		// Word count
		var counts = this.wordCount();
		document.querySelector("#word-count-A").innerHTML = counts.authorA.toFixed(2);
		document.querySelector("#word-count-B").innerHTML = counts.authorB.toFixed(2);

		// Number of messages
		var messages = this.numberOfMessages();
		document.querySelector("#message-num-A").innerHTML = messages.authorA;
		document.querySelector("#message-num-B").innerHTML = messages.authorB;

		// Authors
		document.querySelector("#author-A").innerHTML = this.Convo.authorAName;
		document.querySelector("#author-B").innerHTML = this.Convo.authorBName;
	},

	numberOfMessages: function () {
		return this.Convo.getNumberOfMessagesByAuthor();
	},

	wordCount: function () {
		return this.Convo.getMessageWordCountAverage();
	},

	/*
	Events on the dashboard
	*/

	addEvents: function () {
		var searchForm = document.getElementById("search-form");
		searchForm.addEventListener('submit', function (e) {
			e.preventDefault();
		});

		var searchBox = document.getElementById("search-box");
		searchBox.addEventListener('keypress', searchText.bind(this, searchBox, 'a'));
	},

	render: function () {
		this.authorsLegend();
		this.spectrogram();
		this.fillDataTable();
		this.timeofDay();
		this.responseTimes();
		this.addEvents();
	}
}

/*
*
* Other utility function
*
*/

function searchText (searchBox, a, e) {
	var messages = this.messages;

	if(e.keyCode === 13){
		var toDisplay = [];
		var valueRE = new RegExp("(" + searchBox.value + ")");

		for (var i = 0; i < messages.length; i++) {
			if (messages[i].text.search(valueRE) !== -1) {
				toDisplay.push(messages[i]);
			};
		}

		if (toDisplay.length > 0) {
			this.displaySomeMessages(toDisplay);
		}
	}
	return false;
}

},{"./conversation.js":2}]},{},[1]);
