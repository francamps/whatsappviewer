module.exports = {
  render: function (args) {
    var w = args.options.w,
        marginH = args.options.marginH,
        h = args.options.h,
        pink = args.options.pink,
        purple = args.options.purple,
        gold = args.options.gold,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var resps = Convo.getResponseTimes();
  	var respsDay = Convo.getResponseTimesByAuthorDay();
    var silences = Convo.getSilences();

  	d3.select('#widget-3 svg').remove();

  	var svg = d3.select('#widget-3').append('svg')
  							.attr('width', w)
  							.attr('height', h);

  	var timeScale = d3.scaleTime()
                      .domain([Convo.date0, Convo.dateF])
                      .range([marginH, w - marginH]);

  	var yScale = d3.scaleLinear()
  										.domain([0, 86400000])
  										.range([0, h/2]);

    var colW = timeScale(d3.timeDay.offset(Convo.date0, 1)) - timeScale(Convo.date0);

    var parse = d3.timeParse(dayFormat);

    svg.selectAll(".lineA")
  	      .data(respsDay.authorA.filter(Boolean))
          .enter().append("rect")
  	      .attr("class", "lineA respLine")
  	      .attr("x", function (d, i) { return timeScale(parse(d.datetime)); })
          .attr("y", function (d) { return h / 2 - yScale(d.responseTime); })
          .attr("width", w / respsDay.authorA.length - 2)
          .attr("height", function (d) { return yScale(d.responseTime); })
  				.style("fill", pink);

    svg.selectAll(".lineB")
  	      .data(respsDay.authorB.filter(Boolean))
          .enter().append("rect")
  	      .attr("class", "lineB respLine")
  	      .attr("x", function (d, i) { return timeScale(parse(d.datetime)); })
          .attr("y", function (d) { return h / 2; })
          .attr("width", colW - 2)
          .attr("height", function (d) { return yScale(d.responseTime); })
      		.style("fill", purple)

    svg.selectAll(".respLine")
      .style("stroke", "none");

    var lineFn = d3.line()
      .x(function (d, i) { return timeScale(parse(d.datetime)) + colW / 2; })
      .y(function (d) { return h / 2 - yScale(d.responseTimeDifference); })
      .defined(function (d) {
        return (d.responseTimeDifference);
      })
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .attr("d", lineFn(respsDay.difference))
      .style("stroke", gold)
      .style("stroke-width", "2px")
      .style("fill", "none");

    var msgs = svg.append("g");

    var daysA = msgs.selectAll(".day-message-circles")
      .data(d3.map(respsDay.authorAAll).entries())
      .enter().append("g");

    var daysB = msgs.selectAll(".day-message-circles")
      .data(d3.map(respsDay.authorBAll).entries())
      .enter().append("g");

    daysA.each(function (d, i) {
        d3.select(this)
          .selectAll(".message-circle")
          .data(d.value)
          .enter().append("circle")
          .attr("class", "message-circle")
          .attr("cx", marginH + (i + 1/2) * colW)
          .attr("cy", function (b) { return h / 2 - yScale(b); })
          .attr("r", 2)
          .style("fill", pink);
      });

    daysB.each(function (d, i) {
        d3.select(this)
          .selectAll(".message-circle")
          .data(d.value)
          .enter().append("circle")
          .attr("class", "message-circle")
          .attr("cx", marginH + (i + 1/2) * colW)
          .attr("cy", function (b) { return h / 2 + yScale(b); })
          .attr("r", 2)
          .style("fill", purple);
      });

    d3.selectAll(".message-circle")
      .style("stroke-width", "1")
      .style("opacity", .6)
      .style("stroke", "white");

    var silences = svg.append("g");

    silences.selectAll('.waitingLine')
      .data(silences)
      .enter().append("circle")
      .attr("class", "waitingLine")
      .attr("cx", function (d, i) {
        return (i + 1) * colW - colW / 2;
      })
      .attr("cy", h / 2)
      .attr("r", 5)
      .style("opacity", .15)
      .style("fill", function (d, i) {
        if (!d) {
          return "none";
        } else if (d === Convo.authorAName){
          return pink;
        }
        return purple;
      });
  },

  ticksAndLabels: function () {
    svg.append("text")
      .attr("class", "time-label")
      .attr("x", marginH)
      .attr("y", h / 4 - 10)
      .style("text-anchor", "start")
      .text(labelFormat(Convo.date0));

    svg.append("line")
      .attr("class", "tick")
      .attr("x1", marginH)
      .attr("x2", marginH)
      .attr("y1", h / 4 + 10)
      .attr("y2", h / 4 + 60);

    svg.append("text")
      .attr("class", "time-label")
      .attr("x", timeScale(respsDay.difference.length))
      .attr("y", h / 4 - 10)
      .style("text-anchor", "end")
      .text(labelFormat(Convo.dateF));

    svg.append("line")
      .attr("class", "tick")
      .attr("x1", timeScale(respsDay.difference.length))
      .attr("x2", timeScale(respsDay.difference.length))
      .attr("y1", h / 4 + 10)
      .attr("y2", h / 4 + 60);
  }
}
