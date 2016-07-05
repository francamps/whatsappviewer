'use strict';

import getDateFormats from '../utilities/date-formats';

/* Model for parsed Chat.
(Pseudo) Private methods
* _parseDateFormat
* _parseAuthors
* _calculateDateLimits
* _parseErrorHandler
* _parseTextData
* _createObjectWithDateKeys
* _bundleByAuthorAndDay
* _reduceResponseTimesPerDay

Public methods
* getMessages
* getMessagesByAuthorAndDay
* getMessagesByDay
* getDateRange
* getCharacters
* getCharactersByAuthorAndDay
* getMessageLengths
* getMessageWordCount
* getMessageWordCountAverage
* getMessageWordCountMedian
* getMedian
* getMedianMessageLen
* getNumberOfMessagesByAuthor
* getMessageTimes
* getTimeDifference
* getResponseTimes
* getResponseTimesByAuthorDay
* getSilences

*/

export default class Conversation {
	constructor (data) {
		// Some initializing functions
		this.datetimeFormat = "%-m/%-d/%-y, %-H:%M %p";
		this.dayFormat = "%Y-%m-%d";
		this.data = data || '';
		this.authors = {};
		this.dateFormats = getDateFormats();
		this.messages = [];

		// Initial, neurtal parsing
		this._parseTextData();
	}

	getMessages () {
		return this.messages;
	}

	// Go through possible date formats to find the one
	// the format that will let us parse through the messages
	_parseDateFormat (date) {
		let error = true,
				formats = this.dateFormats,
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
				if (e instanceof TypeError) {
					i++;
				}
				console.log('Unknown parsing error.');
			}
		}
		return error;
	}

	_parseAuthors () {
		this.authorAName = d3.keys(this.authors)[0];
		this.authorBName = d3.keys(this.authors)[1];
	}

	_calculateDateLimits () {
    let datetime0 = this.messages[0].datetime,
				datetimeF = this.messages[this.messages.length - 1].datetime;

		this.date0 = d3.timeParse(this.dayFormat)(datetime0).getTime();
		this.dateF = d3.timeParse(this.dayFormat)(datetimeF).getTime();
		this.daysNum = (this.dateF - this.date0) / 86400000;
	}

	getDateRange () {
		return d3.timeDays(this.date0, d3.timeDay.offset(this.dateF, 1));
	}

	_parseErrorHandler () {
		this.parsingError = "There was an error parsing your chat. Sorry :/";
	}

	_parseTextData () {
		// It is a new line if it contains date time and author
		// Every line as chopped by ' - ' contains author, message
		// plus the author of the NEXT message.
		// If we chopped using '\n' we would risk chopping also messages that have
		// line breaks in the text, so we use ' - '
		this.linesAuthored = this.data.split(' - ');

		// First item is the date of first message
		// Use this to decide on date formatting
		let previousDate = this.linesAuthored[0];
		let parseErrorFound = this._parseDateFormat(previousDate);

		if (parseErrorFound) {
			// Unable to parse datetime formatting
			this._parseErrorHandler();
		} else {
			for (let i = 1; i < this.linesAuthored.length; i++) {
				// Author, message text for THIS message,
				// together with datetime for the FOLLOWING message
				let line = this.linesAuthored[i];

				// Datetime for this message is contained in the previous line item
				let datetime = previousDate;

				// The message text will be finished by a \n,
				// so even if there are more line breaks within the text,
				// we'll catch the whole thing
				let	thisline = line.split('\n');

				// Set this line's datetime as the FOLLOWING's message datetime
				previousDate = thisline[thisline.length - 1];

				// Message is the whole thing minus de number of characters
				// taken by the datetime at the end of the line
				let authorPlusMessageLength = line.length - previousDate.length,
						authorPlusMessage = line.substr(0, authorPlusMessageLength);

				// Author is the first part of splitting by a colon
				let author = authorPlusMessage.split(': ')[0],
						message = authorPlusMessage.substr(author.length, authorPlusMessageLength);

				// If message seems properly pased, store it
				if (author && message) {
					// Store authors
					if (!(author in this.authors)) {
						this.authors[author] = true;
					}

					// Store author names in variables
					this._parseAuthors();

					// TODO: Catch all weird cases
					// TODO: More resilient parsing, please!
					if (datetime && author && message) {
						let datetimeObj = d3.timeParse(this.datetimeFormat)(datetime);
						this.messages.push({
							'datetime': d3.timeFormat(this.dayFormat)(datetimeObj),
							'datetimeObj': datetimeObj,
							'author': author,
							'text': message
						});
					}
				}
			}
			// Date limits
			this._calculateDateLimits();

			// Flag success
			this.isParsed = true;
		}
	}

	getMessagesByDay (day) {
		// If already computed, return it
		if (this.messagesByDay) return this.messagesByDay;

		let messages = [];

		// Variable day needs to be of type date
		let isDate = (Object.prototype.toString.call(day) === "[object Date]");

		if (isDate) {
			let dayString = d3.timeFormat(this.dayFormat)(day);

			this.messages.forEach((message, i) => {
				if (message.datetime === dayString) {
					messages.push(message);
				}
			});
		}

		this.messagesByDay = messages;
		return this.messagesByDay;
	}

	_createObjectWithDateKeys () {
		let dates = this.getDateRange();
		let obj = {}

		dates.forEach((d) => obj[d3.timeFormat(this.dayFormat)(d)] = []);
		return obj;
	}

	_bundleByAuthorAndDay () {
		let authorAbyDay = this._createObjectWithDateKeys(),
				authorBbyDay = this._createObjectWithDateKeys();

		let messages = this.getMessages();

		// Separate data objects by authors
		// and bundle them by day
		messages.forEach((message) => {
			let day = message.datetime;
			// Author A
			if (message.author === this.authorAName) {
				authorAbyDay[day].push(message);

			// Author B
			} else if (message.author === this.authorBName) {
				authorBbyDay[day].push(message);
			}
		});

		return {
			authorAbyDay: authorAbyDay,
			authorBbyDay: authorBbyDay
		}
	}

	getMessagesByAuthorAndDay () {
		// If already computed, return it
		if (this.messagesByAuthorAndDay) return this.messagesByAuthorAndDay;

		let messages = this.getMessages();

		let authorA = [],
				authorB = [];

		let {authorAbyDay, authorBbyDay} = this._bundleByAuthorAndDay();

		// Array of days
		let dateRange = this.getDateRange();

		// Put messages in array of days,
		// fill in those days with no text with silence
		// REVIEW THIS
		for (let day in dateRange) {
			let date = dateRange[day],
					dayString = d3.timeFormat(this.dayFormat)(date);

			if (authorAbyDay[dayString].length > 1) {
				authorA.push(authorAbyDay[dayString]);
			} else {
				authorA.push([{
					author: this.authorAName,
					datetime: dayString,
					datetimeObj: date,
					text: ''
				}]);
			}

			if (authorBbyDay[dayString].length > 1) {
				authorB.push(authorBbyDay[dayString]);
			} else {
				authorB.push([{
					author: this.authorBName,
					datetime: dayString,
					datetimeObj: date,
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
	}

	getCharacters (day) {
		// day is an array of messages for a given day
		let numberOfChars = 0,
				datetime = '';

		if (day.length > 0) {
			datetime = day[0].datetime;
			day.forEach((message) => numberOfChars += message.text.length);
		}

		return {
			chars: numberOfChars,
			datetime: datetime
		}
	}

	getCharactersByAuthorAndDay () {
		// If already computed, return it
		if (this.charactersByAuthorAndDay) return this.charactersByAuthorAndDay;

		let messages = this.getMessagesByAuthorAndDay();

		let charsDayA = [],
				charsDayB = [];

		messages.authorA.forEach((day) => charsDayA.push(this.getCharacters(day)));
		messages.authorB.forEach((day) => charsDayB.push(this.getCharacters(day)));

		this.charactersByAuthorAndDay = {
			authorA: charsDayA,
			authorB: charsDayB
		}

		return this.charactersByAuthorAndDay;
	}

	getMessageLengths () {
		// If already computed, return it
		if (this.messageLengths) return this.messageLengths;

		let lengths = [];
		this.messages.forEach((message) => {
			if (message.text.substr(0, 15) !== "<Media omitted>") {
				lengths.push(message.text.length);
			}
		})

		this.messageLengths = lengths;
		return this.messageLengths;
	}

	getMessageWordCount () {
		// If already computed, return it
		if (this.messageWordCount) return this.messageWordCount;

		let countsA = [],
				countsB = [];

		this.mediaMessages = []

		this.messages.forEach((message) => {
			// Omit audios
			if (message.text.substr(0, 15) !== "<Media omitted>") {
				if (message.author === this.authorAName) {
					countsA.push(message.text.split(' ').length);
				} else {
					countsB.push(message.text.split(' ').length);
				}
			} else {
				this.mediaMessages.push(msg);
			}
		});

		// Sort response times
		countsA.sort((a, b) => a - b);
		countsB.sort((a, b) => a - b);

		this.messageWordCount = {
			authorA: countsA,
			authorB: countsB
		};

		return this.messageWordCount;
	}

	getMessageWordCountAverage () {
		// If already computed, return it
		if (this.messageWordCountAverage) return this.messageWordCountAverage;

		let counts = this.getMessageWordCount();

		let avgA = 0,
				avgB = 0;

		counts.authorA.forEach((d) => avgA += d);
		counts.authorB.forEach((d) => avgB += d);

		this.messageWordCountAverage = {
			authorA: avgA / counts.authorA.length,
			authorB: avgB / counts.authorB.length
		};

		return this.messageWordCountAverage;
	}

	getMedian (counts) {
		// Assumes counts is sorted
		let halfLength = counts.length / 2;
		if (counts.length % 2 === 0) {
			return (counts[halfLength - 1] + counts[halfLength]) / 2;
		}
		return counts[Math.floor(halfLength)];
	}

	getMessageWordCountMedian () {
		// If already computed, return it
		if (this.messageWordCountMedian) return this.messageWordCountMedian;

		let counts = this.getMessageWordCount();

		this.messageWordCountMedian = {
			authorA: this.getMedian(counts.authorA),
			authorB: this.getMedian(counts.authorB)
		};

		return this.messageWordCountMedian;
	}

	getMedianMessageLen () {
		// If already computed, return it
		if (this.medianMessageLen) return this.medianMessageLen;

		let lens = this.getMessageLengths();

		this.medianMessageLen = this.getMedian(lens);
		return this.medianMessageLen;
	}

	getNumberOfMessagesByAuthor () {
		// If already computed, return it
		if (this.numberOfMessagesByAuthor) return this.numberOfMessagesByAuthor;

		let authorA = _.filter(this.messages, { author: this.authorAName }),
				authorB = _.filter(this.messages, { author: this.authorBName });

		this.numberOfMessagesByAuthor = {
			authorA: authorA.length,
			authorB: authorB.length
		};

		return this.numberOfMessagesByAuthor;
	}

	getMessageTimes () {
		// If already computed, return it
		if (this.messageTimes) return this.messageTimes;

		let hourTimeFormat = d3.timeFormat('%H');

		// Empty arrays with 24 items, one for each position
		let authorA = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0),
				authorB = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);

		this.messages.forEach((message) => {
			let hour = parseInt(hourTimeFormat(message.datetimeObj));
			if (message.author === this.authorAName) {
				authorA[hour] += 1;
			} else {
				authorB[hour] += 1;
			}
		});

		this.messageTimes = {
			authorATimes: authorA,
			authorBTimes: authorB
		};

		return this.messageTimes;
	}

	getTimeDifference (responder, prompter) {
		let dateResponse = responder.datetimeObj.getTime(),
				datePrompt = prompter.datetimeObj.getTime();

		return Math.abs(dateResponse - datePrompt);
	}

	getResponseTimes () {
		// If already computed, return it
		if (this.responseTimes) return this.responseTimes;

		let authorAresps = [],
				authorBresps = [];

		for (let i = 2; i < this.messages.length; i++) {
			let responder = this.messages[i],
					prompter = this.messages[i - 1];

			if (responder.author !== prompter.author) {
				let diff = this.getTimeDifference(responder, prompter);

				if (responder.author === this.authorAName) {
					authorAresps.push(diff);
				} else if (responder.author === this.authorBName){
					authorBresps.push(diff);
				}
			}
		}

		// Sort response times
		authorAresps.sort((a, b) => a - b);
		authorBresps.sort((a, b) => a - b);

		this.responseTimes = {
			authorA: authorAresps,
			authorB: authorBresps
		};

		return this.responseTimes;
	}

	_reduceResponseTimesPerDay (d, dayString) {
		if (d.length > 0) {
			return {
				responseTime: d.reduce((m, n) => m + n) / d.length,
				datetime: dayString
			}
		}
	}

	getResponseTimesByAuthorDay () {
		// If already calculated, return it
		if (this.responseTimesByAuthorDay) return this.responseTimesByAuthorDay;

		let authorAresps = {},
				authorBresps = {};

		let formatFn = d3.timeFormat(this.dayFormat);

		for (let i = 0; i < this.daysNum + 2; i++) {
			let date = d3.timeDay.offset(this.date0, i),
					thisDate = formatFn(date);
			authorAresps[thisDate] = [];
			authorBresps[thisDate] = [];
		}

		// Get response time difference per day
		for (let i = 2; i < this.messages.length; i++) {
			let responder = this.messages[i].author,
					prompter = this.messages[i - 1].author;

			let dayString = formatFn(this.messages[i].datetimeObj);

			if (responder !== prompter) {
				let dateResponse = this.messages[i].datetimeObj.getTime(),
				 		datePrompt = this.messages[i - 1].datetimeObj.getTime();

				let diff = Math.abs(dateResponse - datePrompt);

				if (diff < 86400000) {
					if (responder === this.authorAName) {
						authorAresps[dayString].push(diff);
					} else if (responder === this.authorBName){
						authorBresps[dayString].push(diff);
					}
				}
			}
		}

		let respsAvgDiff = [];

		let authorArespsAvg = _.map(authorAresps, this._reduceResponseTimesPerDay),
				authorBrespsAvg = _.map(authorBresps, this._reduceResponseTimesPerDay);

		for (let i = 0; i < this.daysNum; i++) {
			let diff = undefined;
			if (authorArespsAvg[i] && authorBrespsAvg[i]) {
				diff = authorArespsAvg[i].responseTime - authorBrespsAvg[i].responseTime;
			}

			let dayString = formatFn(d3.timeDay.offset(this.date0, i));

			respsAvgDiff.push({
				responseTimeDifference: diff,
				datetime: dayString
			});
		};

		this.responseTimesByAuthorDay = {
			authorA: authorArespsAvg,
			authorB: authorBrespsAvg,
			authorAAll: authorAresps,
			authorBAll: authorBresps,
			difference: respsAvgDiff
		};

		return this.responseTimesByAuthorDay;
	}

	getSilences () {
		// If already calculated, return it
		if (this.silences) return this.silences;

		let messages = this.getMessagesByAuthorAndDay(),
				dateRange = this.getDateRange();

		let authorA = messages.authorAbyDay,
				authorB = messages.authorBbyDay;

		let silenceHeldBy,
				lastChattyDate = d3.timeFormat(this.dayFormat)(dateRange[0]);

		let silences = {}

		// For each date, if nobody talks, fill in with who spoke the last
		dateRange.forEach((date) => {
			let day = d3.timeFormat(self.dayFormat)(date);
			silences[day] = false;

			let isALastOneToTalk = (lastChattyDate in authorA),
					isBLastOneToTalk = (lastChattyDate in authorB);

			if (day in authorA || day in authorB) {
				lastChattyDate = day;
			} else {
				// Find last one to talk
				if (isALastOneToTalk && !(isBLastOneToTalk)) {
					silences[day] = self.authorAName;

				} else if (isBLastOneToTalk && !(isALastOneToTalk)) {
					silences[day] = self.authorBName;

				} else if (isALastOneToTalk && isBLastOneToTalk) {
					let msgTimeA = _.last(authorA[lastChattyDate]).datetimeObj.getTime(),
					 		msgTimeB = _.last(authorB[lastChattyDate]).datetimeObj.getTime();

					silences[day] = (msgTimeA > msgTimeB) ? this.authorAName : this.authorBName;
				}
			}
		});
		this.silences = _.map(silences, (d, dayString) => d);

		return this.silences;
	}
}
