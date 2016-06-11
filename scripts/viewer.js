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
