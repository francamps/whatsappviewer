'use strict';

// Model
var Conversation = require('./conversation.js');

// Views
var spectrogram = require('./views/spectrogram.js');
var responseTimesTime = require('./views/response-times-day.js');
var responseTimesHist = require('./views/response-times-hist.js');
var timeofDay = require('./views/time-of-day.js');

// View configuration data
var pink = 'rgb(243, 38, 114)',
		purple = 'rgb(71, 3, 166)';

var w = document.querySelector(".widget").offsetWidth - 44,
		h = 400,
		marginH = 20;

var dayFormat = d3.time.format("%Y-%m-%d"),
		labelFormat = d3.time.format("%b %d '%y");

var opts = {
	pink: pink,
	purple: purple,
	w: w,
	h: h,
	marginH: marginH,
	dayFormat: dayFormat,
	labelFormat: labelFormat
}

module.exports = {
	init: function (whatsapp) {
		this.data = whatsapp;
		this.Convo = new Conversation(this.data);
		if (this.Convo.isParsed) {
			this.messages = this.Convo.getMessages();
			return true;
		}
	},

	// Get authors names from Conversation and display a legend
	authorsLegend: function (svg) {
		document.querySelector("#author-A-col").style.background = pink;
		document.querySelector("#author-B-col").style.background = purple;
		document.querySelector("#author-A-leg-label").innerHTML = this.Convo.authorAName;
		document.querySelector("#author-B-leg-label").innerHTML = this.Convo.authorBName;
	},

	// Volume of messages over time
	spectrogram: function () {
		var Convo = this.Convo;
		spectrogram.render({
			Convo: Convo,
			options: opts
		});
		spectrogram.addEvents(this.messages);
	},

	// Response times over time
	responseTimes: function () {
		var Convo = this.Convo;
		responseTimesTime.render.call(this, {
			Convo: Convo,
			options: opts
		});
	},

	// Volume of messages per time of day
	timeofDay: function () {
		var Convo = this.Convo;
		timeofDay.render.call(this, {
			Convo: Convo,
			options: opts
		});
	},

	// Distribution of response times per author
	responseTimesHist: function () {
		var Convo = this.Convo;
		responseTimesHist.render({
			Convo: Convo,
			options: opts
		});
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
		return this.Convo.getMessageWordCountMedian();
	},

	render: function () {
		this.authorsLegend();
		this.spectrogram();
		this.fillDataTable();
		this.timeofDay();
		this.responseTimes();
		this.responseTimesHist();
	}
}
