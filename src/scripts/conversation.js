'use strict';

function Conversation (data) {
	// Some initializing functions
	this.datetimeFormat = "%-m/%-d/%-y, %-H:%M %p";
	this.dayFormat = "%Y-%m-%d";
	this.data = data || '';
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
		"%d/%m/%Y",
		"%-d/%-m/%Y",
		/* 15/06/2009 */
		"%m/%d/%Y",
		"%-m/%-d/%Y",
		/* 2009/06/15 */
		"%Y/%m/%d",
		"%Y/%-m/%-d",
		/* Monday, June 15, 2009 */
		"%b %d, %Y",
		"%b, %d, %Y",
		/* Monday, June 15, 2009 1:45 PM */
		"%b %d, %Y, %H:%M %p",
		"%b, %d, %Y, %H:%M %p",
		/* Monday, June 15, 2009 1:45:30 PM */
		"%b %d, %Y, %H:%M:%S %p",
		"%b, %d, %Y, %H:%M:%S %p",
		/* 6/15/2009 1:45 PM */
		"%-m/%-d/%-y, %-I:%M %p",
		/* 15/06/2009 13:45 */
		"%-m/%-d/%-y, %H:%M",
		/* 06/15/2009 13:45 */
		"%-d/%-m/%-y, %H:%M %p",
		/* 2009/6/15 13:45 */
		"%Y/%-m/%-d, %H:%M",
		/* 15/06/2009 13:45:30 */
		"%-d/%-m/%Y, %H:%M:%S",
		/* 6/15/2009 1:45:30 PM */
		"%m/%-d/%Y, %I:%M:%S %p",
		/* 2009/6/15 13:45:30 */
		"%Y/%m/%-d, %H:%M:%S",
		/* 2009-06-15T13:45:30 */
		"%Y-%-m-%-dT%H:%M:%S",
		/* 2009-06-15 13:45:30Z */
		"%Y-%-m-%-d %H:%M:%SZ",
		/* Monday, June 15, 2009 8:45:30 PM */
		"%b, %m %d, %H:%M:%S %p",
		/* */
		"%-m/%-d/%-y, %-H:%M %p",
		"%-m/%-d/%-Y, %-H:%M %p",
		"%Y-%m-%d, %H:%M:%S",
		"%b %d, %Y, %H:%M %p"
	],

	calculateDateLimits: function () {
    var datetime0 = this.messages[0].datetime,
				datetimeF = this.messages[this.messages.length - 1].datetime;

		this.date0 = d3.timeParse(this.dayFormat)(datetime0);
		this.dateF = d3.timeParse(this.dayFormat)(datetimeF);
		this.daysNum = (this.dateF.getTime() - this.date0.getTime()) / 86400000;
	},

	parseDateFormat: function (date) {
		var error = true;
		var formats = this.dateFormats,
				i = 0;

		while (i < formats.length && error === true) {
			try {
				if (d3.timeParse(formats[i])(date) !== null) {
					error = false;
					this.datetimeFormat = formats[i];
					break;
				}
				i++;
			} catch (e) {
				console.log(e);
				if (e instanceof TypeError) {
					i++;
				}
				console.log('Unknown error.');
			}
		}
		return error;
	},

	parseAuthors: function () {
		this.authorAName = Object.keys(this.authors)[0];
		this.authorBName = Object.keys(this.authors)[1];
	},

	getDateRange: function () {
		return d3.timeDays(this.date0, d3.timeDay.offset(this.dateF, 1));
	},

	parseErrorHandler: function () {
		this.parsingError = "There was an error parsing the text. Sorry :/";
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

				if (author && message) {
					if (!(author in this.authors)) {
						this.authors[author] = true;
					}

					this.parseAuthors();

					// TODO: Catch all weird cases
					// TODO: More resilient parsing, please!
					if (datetime && author && message) {
						this.messages.push({
							'datetime': d3.timeFormat(this.dayFormat)(d3.timeParse(this.datetimeFormat)(datetime)),
							'datetimeObj': d3.timeParse(this.datetimeFormat)(datetime),
							'author': author,
							'text': message
						});
					}
				}
			}
			// Date limits
			this.calculateDateLimits();

			// Flag success
			this.isParsed = true;
		}
	},

	getConvFormat: function () {
		return this.datetimeFormat;
	},

	getMessagesByDay: function (day) {
		// If already computed, return it
		if (this.messagesByDay) return this.messagesByDay;

		// Variable day needs to be of type date
		var messages = [];
		if (Object.prototype.toString.call(day) === "[object Date]") {
			var dayStr = d3.timeFormat(this.dayFormat)(day);
			for (var i = 0; i < this.messages.length; i++) {
				if (this.messages[i].datetime === dayStr) {
					messages.push(this.messages[i]);
				}
			}
		}
		this.messagesByDay = messages;
		return this.messagesByDay;
	},

	getMessagesByAuthorAndDay: function () {
		// If already computed, return it
		if (this.messagesByAuthorAndDay) return this.messagesByAuthorAndDay;

		var messages = this.getMessages();

		var authorA = [],
				authorAbyDay = {};

		var authorB = [],
				authorBbyDay = {};

		// Separate data objects for authors
		// and bundle them by day
		var self = this;

		messages.forEach(function (msg) {
			var day = msg.datetime;
			if (msg.author === self.authorAName) {
				if (!(msg.datetime in authorAbyDay)) {
					authorAbyDay[msg.datetime] = [];
				}
				authorAbyDay[msg.datetime].push(msg);
			} else {
				if (!(msg.datetime in authorBbyDay)) {
					authorBbyDay[msg.datetime] = [];
				}
				authorBbyDay[msg.datetime].push(msg);
			}
		});

		// Array of days
		var dateRange = this.getDateRange();

		for (var day in dateRange) {
			var date = dateRange[day];
			var dayString = d3.timeFormat(this.dayFormat)(date)

			if (dayString in authorAbyDay) {
				authorA.push(authorAbyDay[dayString]);
			} else {
				// Fill day item with empty text
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

		this.messagesByAuthorAndDay = {
			authorA: authorA,
			authorB: authorB,
			authorAbyDay: authorAbyDay,
			authorBbyDay: authorBbyDay
		};

		return this.messagesByAuthorAndDay;
	},

	getCharactersByAuthorAndDay: function () {
		// If already computed, return it
		if (this.charactersByAuthorAndDay) return this.charactersByAuthorAndDay;

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

		this.charactersByAuthorAndDay = {
			authorA: charsDayA,
			authorB: charsDayB
		}

		return this.charactersByAuthorAndDay;
	},

	getMessageLengths: function () {
		// If already computed, return it
		if (this.messageLengths) return this.messageLengths;

		var lengths = [];
		for (var i = 0; i < this.messages.length; i++) {
			if (this.messages[i].text.substr(0, 15) !== "<Media omitted>") {
				lengths.push(this.messages[i].text.length);
			}
		}
		this.messageLengths = lengths;
		return this.messageLengths;
	},

	getMessageWordCount: function () {
		// If already computed, return it
		if (this.messageWordCount) return this.messageWordCount;

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

		this.messageWordCount = {
			authorA: countsA,
			authorB: countsB
		};

		return this.messageWordCount;
	},

	getMessageWordCountAverage: function () {
		// If already computed, return it
		if (this.messageWordCountAverage) return this.messageWordCountAverage;

		var counts = this.getMessageWordCount();
		var avgA = 0,
				avgB = 0;
		counts.authorA.forEach(function (d) {
			avgA += d;
		});
		counts.authorB.forEach(function (d) {
			avgB += d;
		});

		this.messageWordCountAverage = {
			authorA: avgA / counts.authorA.length,
			authorB: avgB / counts.authorB.length
		};

		return this.messageWordCountAverage;
	},

	getMessageWordCountMedian: function () {
		// If already computed, return it
		if (this.messageWordCountMedian) return this.messageWordCountMedian;

		var counts = this.getMessageWordCount();
		this.messageWordCountMedian = {
			authorA: counts.authorA[Math.floor(counts.authorA.length/2)],
			authorB: counts.authorB[Math.floor(counts.authorB.length/2)]
		};

		return this.messageWordCountMedian;
	},

	getMedianMessageLen: function () {
		// If already computed, return it
		if (this.medianMessageLen) return this.medianMessageLen;

		var lens = this.getMessageLengths();
		if (lens.length % 2 === 0) {
			var halfLen = Math.floor(lens/2);
			return (lens[halfLen - 1] + lens[halfLen + 1]) / 2;
		}
		this.medianMessageLen = lens[Math.floor(lens.length / 2) + 1];
		return this.medianMessageLen;
	},

	getNumberOfMessagesByAuthor: function () {
		// If already computed, return it
		if (this.numberOfMessagesByAuthor) return this.numberOfMessagesByAuthor;

		var authorA = _.filter(this.messages, { author: this.authorAName }),
				authorB = _.filter(this.messages, { author: this.authorBName });

		this.numberOfMessagesByAuthor = {
			authorA: authorA.length,
			authorB: authorB.length
		};

		return this.numberOfMessagesByAuthor;
	},

	getMessageTimes: function () {
		// If already computed, return it
		if (this.messageTimes) return this.messageTimes;

		var timeformat = d3.timeFormat('%H');
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

		this.messageTimes = {
			authorATimes: authorA,
			authorBTimes: authorB
		};

		return this.messageTimes;
	},

	getResponseTimes: function () {
		// If already computed, return it
		if (this.responseTimes) return this.responseTimes;

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

		this.responseTimes = {
			authorA: authorAresps,
			authorB: authorBresps
		};

		return this.responseTimes;
	},

	getSilences: function () {
		// If already calculated, return it
		if (this.silences) return this.silences;

		var messages = this.getMessagesByAuthorAndDay();
		var dateRange = this.getDateRange();

		var self = this;
		var authorA = messages.authorAbyDay;
		var authorB = messages.authorBbyDay;
		var silenceHeldBy;
		var lastChattyDate = d3.timeFormat(this.dayFormat)(dateRange[0]);
		var silences = {}
		dateRange.forEach(function (date) {
			var day = d3.timeFormat(self.dayFormat)(date);
			silences[day] = false;
			if (day in authorA || day in authorB) {
				lastChattyDate = day;
			} else {
				// Find last one to talk
				if (lastChattyDate in authorA && !(lastChattyDate in authorB)) {
					silences[day] = self.authorAName;
				} else if (lastChattyDate in authorB && !(lastChattyDate in authorA)) {
					silences[day] = self.authorBName;
				} else if (lastChattyDate in authorA && lastChattyDate in authorB) {
					var msgTimeA = _.last(authorA[lastChattyDate]).datetimeObj.getTime();
					var msgTimeB = _.last(authorB[lastChattyDate]).datetimeObj.getTime();
					if (msgTimeA > msgTimeB) {
						silences[day] = self.authorAName;
					} else {
						silences[day] = self.authorBName;
					}
				}
			}
		});
		this.silences = _.map(silences, function (d, dayString) {
			return d;
		});
		return this.silences;
	},

	getResponseTimesByAuthorDay: function () {
		// If already calculated, return it
		if (this.responseTimesByAuthorDay) return this.responseTimesByAuthorDay;

		var authorAresps = {},
				authorBresps = {};

		for (var i = 0; i < this.daysNum + 2; i++) {
			var thisDate = d3.timeFormat(this.dayFormat)(d3.timeDay.offset(this.date0, i));
			authorAresps[thisDate] = [];
			authorBresps[thisDate] = [];
		}

		for (var i = 2; i < this.messages.length; i++) {
			var responder = this.messages[i].author,
					prompter = this.messages[i - 1].author;

			var dayString = d3.timeFormat(this.dayFormat)(this.messages[i].datetimeObj);

			if (responder !== prompter) {
				var dateResp = this.messages[i].datetimeObj;
				var dateOrig = this.messages[i - 1].datetimeObj;

				var diff = Math.abs(dateResp.getTime() - dateOrig.getTime());

				if (diff < 86400000) {
					if (responder === this.authorAName) {
						authorAresps[dayString].push(diff);
					} else if (responder === this.authorBName){
						authorBresps[dayString].push(diff);
					}
				}
			}
		}

		function reduceResponseTimesPerDay(d, dayString) {
			if (d.length > 0) {
				return {
					responseTime: d.reduce(function(m, n) { return m + n; }) / d.length,
					datetime: dayString
				}
			}
		}

		var respsAvgDiff = [];
		var authorArespsAvg = _.map(authorAresps, reduceResponseTimesPerDay);
		var authorBrespsAvg = _.map(authorBresps, reduceResponseTimesPerDay);

		for (var i = 0; i < this.daysNum; i++) {
			var diff = undefined;
			if (authorArespsAvg[i] && authorBrespsAvg[i]) {
				diff = authorArespsAvg[i].responseTime - authorBrespsAvg[i].responseTime;
			}
			var dayString = d3.timeFormat(this.dayFormat)(d3.timeDay.offset(this.date0, i));

			respsAvgDiff.push({
				responseTimeDifference: diff,
				datetime: dayString
			});
		}

		this.responseTimesByAuthorDay = {
			authorA: authorArespsAvg,
			authorB: authorBrespsAvg,
			authorAAll: authorAresps,
			authorBAll: authorBresps,
			difference: respsAvgDiff
		};

		return this.responseTimesByAuthorDay;
	}
}

module.exports = Conversation;
