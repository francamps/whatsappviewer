module.exports = {
  render: function (args) {
    var w = args.options.w,
        marginH = args.options.marginH,
        h = args.options.h,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var resps = Convo.getResponseTimes();
  	var respsDay = Convo.getResponseTimesByAuthorDay();

  	d3.select('#widget-3 svg').remove();

  	var svg = d3.select('#widget-3').append('svg')
  							.attr('width', w)
  							.attr('height', h);

  	var timeScale = d3.time.scale()
  										.domain([d3.time.day.offset(Convo.date0, 1), Convo.dateF])
  										.range([marginH, w - marginH]);

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

    var linefunction2 = d3.svg.line()
  	    .x(function(d) {
  				return timeScale(dayFormat.parse(d.datetime));
  			})
  	    .y(function(d) {
  				return -1 + yScale(-d.responseTime);
  			})
  			.interpolate("step-before");

  	svg.append("path")
  	      .datum(respsDay.authorA)
  	      .attr("class", "lineA respLine")
  	      .attr("d", linefunction)
  				.style("fill", pink)
          .style("stroke", pink);

  	svg.append("path")
  	      .datum(respsDay.authorB)
  	      .attr("class", "lineB respLine")
  	      .attr("d", linefunction2)
  				.style("fill", purple)
          .style("stroke", purple);

  	d3.selectAll(".respLine")
  				.style("stroke-width", "1px");

  	svg.append("text")
  		.attr("class", "time-label")
  		.attr("x", marginH)
  		.attr("y", 3 * h / 4 + 30)
      .style("text-anchor", "start")
  		.text(labelFormat(Convo.date0));

    svg.append("circle")
      .attr("class", "dot")
      .attr("cx", marginH)
  		.attr("cy", 3 * h / 4 + 10)
      .attr("r", "2px");

  	svg.append("text")
  		.attr("class", "time-label")
  		.attr("x", timeScale(Convo.dateF))
  		.attr("y", 3 * h / 4 + 30)
  		.style("text-anchor", "end")
  		.text(labelFormat(Convo.dateF));

    svg.append("circle")
      .attr("class", "dot")
      .attr("cx", timeScale(Convo.dateF))
  		.attr("cy", 3 * h / 4 + 10)
      .attr("r", "2px");
  }
}
