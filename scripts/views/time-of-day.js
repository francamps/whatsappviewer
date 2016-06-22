module.exports = {
  render: function (args) {
    var w = args.options.w,
        h = args.options.h,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var messageTimes = Convo.getMessageTimes();

    d3.select('#widget-2 svg').remove();

    var svg = d3.select('#widget-2').append('svg')
                .attr('width', w)
                .attr('height', 140);

    var r = 20;
    var margin = 20;
    var hourStep = (w - (margin)) / 24;

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
          return "translate(" + (margin + i * hourStep) + "," + (35) + ")";
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
        return "translate(" + (margin + i * hourStep) + "," + (85) + ")";
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
  }
}
