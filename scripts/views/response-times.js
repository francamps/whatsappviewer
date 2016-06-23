module.exports = {
  render: function (args) {
    var w = args.options.w,
        h = args.options.h,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var resps = Convo.getResponseTimes();
  	var respsDay = Convo.getResponseTimesByAuthorDay();

  	d3.select('#widget-3 svg').remove();

  	var h = 140;

  	var svg = d3.select('#widget-3').append('svg')
  							.attr('width', w)
  							.attr('height', h);

  	var timeScale = d3.time.scale()
  										.domain([d3.time.day.offset(Convo.date0, 1), Convo.dateF])
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
  		.attr("y", 3 * h / 4 + 30)
  		.text(labelFormat(Convo.date0));

  	svg.append("text")
  		.attr("class", "time-label")
  		.attr("x", timeScale(Convo.dateF))
  		.attr("y", 3 * h / 4 + 30)
  		.style("text-anchor", "end")
  		.text(labelFormat(Convo.dateF));
  }
}
