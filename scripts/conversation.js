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
