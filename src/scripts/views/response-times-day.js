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

  	var timeScale = d3.scale.linear()
  										.domain([0, respsDay.difference.length])
  										.range([marginH, w - marginH]);

  	var yScale = d3.scale.linear()
  										.domain([0, d3.max(_.map(respsDay.difference, function (d) {
                        return Math.abs(d.responseTimeDifference)
                      }))])
  										.range([0, h/4]);

    /*svg.selectAll(".lineA")
  	      .data(respsDay.authorA)
          .enter().append("rect")
  	      .attr("class", "lineA respLine")
  	      .attr("x", function (d, i) { return i * w / respsDay.authorA.length; })
          .attr("y", function (d) { return h/4 + yScale(d.responseTime); })
          .attr("width", w / respsDay.authorA.length - 2)
          .attr("height", function (d) { return h / 4 - yScale(d.responseTime); })
  				.style("fill", pink)
          .style("stroke", pink);

    svg.selectAll(".lineB")
  	      .data(respsDay.authorB)
          .enter().append("rect")
  	      .attr("class", "lineB respLine")
  	      .attr("x", function (d, i) { return i * w / respsDay.authorB.length; })
          .attr("y", function (d) { return h / 2; })
          .attr("width", w / respsDay.authorB.length - 2)
          .attr("height", function (d) { return h / 4 - yScale(d.responseTime); })
  				.style("fill", purple)
          .style("stroke", purple);*/

    svg.selectAll(".lineD")
  	      .data(respsDay.difference)
          .enter().append("rect")
  	      .attr("class", "lineD respLine")
  	      .attr("x", function (d, i) { return i * w / respsDay.difference.length; })
          .attr("y", function (d) {
            // > 0 means A > B
            if (d.responseTimeDifference > 0) {
              return h / 2 - yScale(d.responseTimeDifference);
            }
            return h / 2;
          })
          .attr("width", w / respsDay.difference.length)
          .attr("height", function (d) {
            if (d.responseTimeDifference > 0) {
              return yScale(d.responseTimeDifference);
            }
            return yScale(-d.responseTimeDifference);
          })
  				.style("fill", function (d) {
            if (d.responseTimeDifference > 0) {
              return pink;
            }
            return purple;
          });

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
