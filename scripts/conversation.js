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
