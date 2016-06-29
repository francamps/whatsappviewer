module.exports = {
  render: function (args, svgID) {
    var w = 200,
        marginH = 10,//args.options.marginH,
        h = 120,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var resps = Convo.getResponseTimes();

    var bucketsA = this.bucketify(resps.authorA).buckets;
    var bucketsB = this.bucketify(resps.authorB).buckets;
    var bucketsAchat = this.bucketify(resps.authorA).buckets15m;
    var bucketsBchat = this.bucketify(resps.authorB).buckets15m;

    var yMax = d3.max([d3.max(bucketsA), d3.max(bucketsB)]);
    var yMaxChat = d3.max([d3.max(bucketsAchat), d3.max(bucketsBchat)]);

    var labels = ["15'-", "1-", "2-", "4-", "12-", ">24h"],
        labelsLow = ["1h", "2h", "4h", "12h", "24h"];

    switch (svgID) {
      case "#resp-times-A":
        var buckets = bucketsA,
            color = pink;
        break;
      case "#resp-times-B":
        var buckets = bucketsB,
            color = purple;
        break;
      case  "#resp-times-chat-A":
        var buckets = bucketsAchat,
            color = pink,
            yMax = yMaxChat,
            labels = ["<2'", "2'-", "5'-", "10'-"],
            labelsLow = ["", "5'", "10'", "15'"];
        break;
      case "#resp-times-chat-B":
        var buckets = bucketsBchat,
            color = purple,
            yMax = yMaxChat,
            labels = ["<2'", "2'-", "5'-", "10'-"],
            labelsLow = ["", "5'", "10'", "15'"];
        break;
    }

    d3.select(svgID + " svg").remove();

  	var svg = d3.select(svgID).append('svg')
  							.attr('width', w)
  							.attr('height', h);

  	var timeScale = function (value) {
      return marginH + value * (w - 2 * marginH) / buckets.length;
    }

  	var yScale = d3.scaleLinear()
      							.domain([0, yMax])
      							.range([0, h - 30]);

    var colW = (w - 2 * marginH) / buckets.length - 2;

    svg.selectAll('.barsHist')
      .data(buckets)
      .enter().append('rect')
      .attr("x", function (d, i) { return timeScale(i); })
      .attr("y", function (d, i) { return h - 30 - yScale(d); })
      .attr("width", colW)
      .attr("height", function (d, i) { return yScale(d); })
      .style("fill", color);

    svg.selectAll(".label")
      .data(labels)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", function (d, i) { return timeScale(i) + colW / 2; })
      .attr("y", function (d, i) { return h - 17; })
      .style("font-size", "10px")
      .style("font-weight", "lighter")
      .style("text-anchor", "middle")
      .text(function (d, i) { return labels[i]; })

    svg.selectAll(".labelLow")
      .data(labelsLow)
      .enter().append("text")
      .attr("class", "labelLow")
      .attr("x", function (d, i) { return timeScale(i) + colW / 2; })
      .attr("y", function (d, i) { return h - 5; })
      .style("font-size", "10px")
      .style("font-weight", "lighter")
      .style("text-anchor", "middle")
      .text(function (d, i) { return labelsLow[i]; })

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
