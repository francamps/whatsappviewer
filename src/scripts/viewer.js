'use strict';

// Model
var Conversation = require('./conversation.js');

// Views
import VolumeTime from './views/volume-time';
import TimeOfDay from './views/time-of-day';
import ResponseTimesHist from './views/response-times-hist';
import ResponseTimesTime from './views/response-times-day';

// View configuration data
const pink = "rgb(243, 38, 114)",
		purple = "rgb(71, 3, 166)",
		gold = "rgb(253, 199, 20)"

//var pink = "rgb(253, 199, 20)", // gold
//		purple = "rgb(71, 3, 166)";

var w = document.querySelector(".widget").offsetWidth - 44,
		h = 400,
		marginH = 20;

var dayFormat = d3.timeFormat("%Y-%m-%d"),
		labelFormat = d3.timeFormat("%b %d '%y");

var opts = {
	pink: pink,
	purple: purple,
	gold: gold,
	w: w,
	h: h,
	marginH: marginH,
	dayFormat: dayFormat,
	labelFormat: labelFormat
}

module.exports = {
	/*
	* Initialize conversation
	* Parse text and create model
	*
	*/
	init: function (text) {
		this.Convo = new Conversation(text);
		if (this.Convo.isParsed) {
			this.messages = this.Convo.getMessages();
			return true;
		} else if (this.Convo.parsingError) {
			this.notifyParsingError(this.Convo.parsingError);
		}
	},

	/*
	*
	* Render different chart views
	*
	*/

	// Get authors names from Conversation and display a legend
	authorsLegend: function (svg) {
		document.querySelector("#author-A-col").style.background = pink;
		document.querySelector("#author-B-col").style.background = purple;
		document.querySelector("#author-A-leg-label").innerHTML =
				this.Convo.authorAName;
		document.querySelector("#author-B-leg-label").innerHTML =
				this.Convo.authorBName;
	},

	// Volume of messages over time
	volumeTime: function () {
		let Convo = this.Convo;
		let VolumeTimeView = new VolumeTime({
			Convo: Convo,
			options: opts
		})
		VolumeTimeView.render();
	},

	// Response times over time
	responseTimes: function () {
		var Convo = this.Convo;
		let ResponseTimesTimeView = new ResponseTimesTime({
			Convo: Convo,
			options: opts
		});
		ResponseTimesTimeView.render();
	},

	// Volume of messages per time of day
	timeofDay: function () {
		let Convo = this.Convo;
		let TimeOfDayView = new TimeOfDay({
			Convo: Convo,
			options: opts
		});
		TimeOfDayView.render();
	},

	// Distribution of response times per author
	responseTimesHist: function () {
		var Convo = this.Convo;
		let ResponseTimesHistViewA = new ResponseTimesHist({
			Convo: Convo,
			options: opts,
			chatMode: false,
			author: "A"
		}, "#resp-times-A")
		let ResponseTimesHistViewB = new ResponseTimesHist({
			Convo: Convo,
			options: opts,
			chatMode: false,
			author: "B"
		}, "#resp-times-B");
		let ResponseTimesHistViewAchat = new ResponseTimesHist({
			Convo: Convo,
			options: opts,
			chatMode: true,
			author: "A"
		}, "#resp-times-chat-A");
		let ResponseTimesHistViewBchat = new ResponseTimesHist({
			Convo: Convo,
			options: opts,
			chatMode: true,
			author: "B"
		}, "#resp-times-chat-B");

		ResponseTimesHistViewA.render();
		ResponseTimesHistViewB.render();
		ResponseTimesHistViewAchat.render();
		ResponseTimesHistViewBchat.render();
	},

	/*
	*
	* Get data from conversation and fill table
	*
	*/

	fillDataTable: function () {
		// Word count
		var countsAvg = this.wordCountAvg();
		var countsMed = this.wordCountMedian();
		document.querySelector("#word-count-A").innerHTML =
				countsAvg.authorA.toFixed(2) + " / " + countsMed.authorA.toFixed(2);
		document.querySelector("#word-count-B").innerHTML =
				countsAvg.authorB.toFixed(2) + " / " + countsMed.authorB.toFixed(2);

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

	wordCountAvg: function () {
		return this.Convo.getMessageWordCountAverage();
	},

	wordCountMedian: function () {
		return this.Convo.getMessageWordCountMedian();
	},

	notifyParsingError: function (message) {
		document.querySelector("#notification").innerHTML = message;
		document.querySelector("#notification").classList.remove('hidden');
	},

	render: function () {
		this.authorsLegend();
		this.volumeTime();
		this.fillDataTable();
		this.timeofDay();
		this.responseTimes();
		this.responseTimesHist();
	}
}
