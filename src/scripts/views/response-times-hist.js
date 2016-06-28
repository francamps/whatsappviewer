module.exports = {
  render: function (args) {
    var w = 200,
        marginH = args.options.marginH,
        h = 80,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var resps = Convo.getResponseTimes();

    var bucketsA = this.bucketify(resps.authorA);
    var bucketsB = this.bucketify(resps.authorB);

    d3.select('#resp-times-A svg').remove();
    d3.select('#resp-times-B svg').remove();

  	var svg = d3.select('#resp-times-A').append('svg')
  							.attr('width', w)
  							.attr('height', h);

    var svgB = d3.select('#resp-times-B').append('svg')
                .attr('width', w)
                .attr('height', h);

  	var timeScale = function (value) {
      return marginH + value * (w - 2 * marginH) / bucketsA.buckets.length;
    }

  	var yScale = d3.scale.linear()
      							.domain([0, d3.max(bucketsA.buckets), d3.max(bucketsB.buckets)])
      							.range([h / 4, 0]);

    svg.selectAll('.barsHist')
      .data(bucketsA.buckets)
      .enter().append('rect')
      .attr("x", function (d, i) { return timeScale(i); })
      .attr("y", function (d, i) { return yScale(d); })
      .attr("width", (w - 2 * marginH) / bucketsA.buckets.length - 2)
      .attr("height", function (d, i) { return h - yScale(d); })
      .style("fill", pink);

    svgB.selectAll('.barsHist')
      .data(bucketsB.buckets)
      .enter().append('rect')
      .attr("x", function (d, i) { return timeScale(i); })
      .attr("y", function (d, i) { return yScale(d); })
      .attr("width", (w - 2 * marginH) / bucketsB.buckets.length - 2)
      .attr("height", function (d, i) { return h - yScale(d); })
      .style("fill", purple);

  },

  bucketify: function (times) {
    var buckets = [
      0, // 1min - 1 h
      0, // 1 - 2 h
      0, // 2 - 4 h
      0, // 4 - 12 h
      0, // 12 - 24 h
      0 // > 24 h
    ];

    // For times lower than 15min, separate data
    var times15m = [];

    for (var i = 0; i < times.length; i++) {
      if (times[i] < 900001) {
         times15m.push(times[i])
      } else if (times[i] < 3600001 && times[i] > 900000) {
        buckets[0]++;
      } else if (times[i] > 3600000 && times[i] < 7200001) {
        buckets[1]++;
      } else if (times[i] > 7200000 && times[i] < 14400001) {
        buckets[2]++;
      } else if (times[i] > 14400000 && times[i] < 43200001) {
        buckets[3]++;
      } else if (times[i] > 43200000 && times[i] < 86400001) {
        buckets[4]++;
      } else if (times[i] > 86400000) {
        buckets[5]++;
      }
    }
    buckets15m = this.bucketify15m(times15m);
    return {
      buckets: buckets,
      buckets15m: buckets15m
    }
  },

  bucketify15m: function (times) {
    var buckets = [
      0, // < 2min
      0, // 2 - 5 min
      0, // 5 - 10 min
      0 // 10 - 15 min
    ];

    for (var i = 0; i < times.length; i++) {
      if (times[i] < 120001) {
        buckets[0]++;
      } else if (times[i] > 120000 && times[i] < 300001) {
        buckets[1]++;
      } else if (times[i] > 300000 && times[i] < 600001) {
        buckets[2]++;
      } else if (times[i] > 600000) {
        buckets[3]++;
      }
    }
    return buckets;
  }
}
