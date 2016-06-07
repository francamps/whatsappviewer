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
