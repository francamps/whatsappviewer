export default class ResponseTimesHist {
  constructor (args, svgID) {
    this.w = 400;
    this.mg = args.options.mg;
    this.h = 180;
    this.colorA = args.options.colorA;
    this.colorB = args.options.colorB;
    this.dayFormat = args.options.dayFormat;
    this.labelFormat = args.options.labelFormat;
    this.Convo = args.Convo;
    this.chatMode = args.options.chatMode;
    this.author = args.author;
    this.svgID = svgID;

    this.resps = args.Convo.getResponseTimes();
    this.getBuckets();
    this.viewTypeAdjustments();
    this.viewSizeAdjustments();
  }

  viewSizeAdjustments () {
    // Make sure the dimensions are correct for the viewport
    let smallVersion = (document.querySelector(".page-wrap").offsetWidth < 800);
    if (smallVersion) {
      this.w = 100;
      this.mg = 5;
    }
  }

  getBuckets () {
    // Buckitfy times on chat mode or not
    // INFO: Chat mode means any response time under 15 minutes
    if (this.chatMode) {
      this.bucketsA = this.bucketify15m(this.resps.authorA);
      this.bucketsB = this.bucketify15m(this.resps.authorB);
    } else {
      this.bucketsA = this.bucketify(this.resps.authorA);
      this.bucketsB = this.bucketify(this.resps.authorB);
    }

    // Y axis limits depend on both author A and B
    this.yMax = d3.max([d3.max(this.bucketsA), d3.max(this.bucketsB)]);
  }

  viewTypeAdjustments () {
    // Choos labels of histogram based on either chatMode or not
    if (this.chatMode) {
      this.labels = ["<2'", "2'-", "5'-", "10'-"];
      this.labelsLow = ["", "5'", "10'", "15'"];
    } else {
      this.labels = ["15'-", "1-", "2-", "4-", "12-", ">24h"];
      this.labelsLow = ["1h", "2h", "4h", "12h", "24h"];
    }
  }

  computeScaleFns () {
    this.timeScale =
      (value) => {
        return value * this.w / this.bucketsA.length;
      }

  	this.yScale =
      d3.scaleLinear()
				.domain([0, this.yMax])
				.range([0, (this.h - 30) / 2]);

    // Adjust column width based on type of buckets
    this.colW = this.w / this.bucketsA.length - 2;
  }

  render () {
    // Please find a better way to do this
    d3.select("#" + this.svgID + " svg").remove();

    // Append SVG to div
  	this.svg = d3.select("#" + this.svgID).append('svg')
                .attr("class", "histoRT-svg")
  							.attr('width', this.w)
  							.attr('height', this.h);

    // Do the thing
    this.computeScaleFns();
    this.addBars();
    this.addLabels();
  }

  // Apend the bars on the histogram
  addBars () {
    let barsHistA = this.svg.selectAll('.barsHistA')
      .data(this.bucketsA)
      .enter().append('rect')
      .attr("class", "barsHistA");

    barsHistA
      .attr("x", (d, i) => this.timeScale(i))
      .attr("y", (d, i) => this.h / 2 - this.yScale(d))
      .attr("width", this.colW)
      .attr("height", (d, i) => this.yScale(d))

    barsHistA
      .style("fill", this.colorA);

    let barsHistB = this.svg.selectAll('.barsHistB')
      .data(this.bucketsB)
      .enter().append('rect')
      .attr("class", "barsHistB");

    barsHistB
      .attr("x", (d, i) => this.timeScale(i))
      .attr("y", (d, i) => this.h / 2)
      .attr("width", this.colW)
      .attr("height", (d, i) => this.yScale(d))

    barsHistB
      .style("fill", this.colorB);
  }

  // Add time buckets labels
  addLabels () {
    // First row of labels
    let labelsHigh = this.svg.selectAll(".labelHigh")
      .data(this.labels)
      .enter().append("text")
      .attr("class", "labelHigh label");

    labelsHigh
      .attr("x", (d, i) => this.timeScale(i) + this.colW / 2)
      .attr("y", (d, i) => this.h - 17)
      .text((d, i) => this.labels[i]);

    // Second row of labels
    let labelsLow = this.svg.selectAll(".labelLow")
      .data(this.labelsLow)
      .enter().append("text")
      .attr("class", "labelLow label");

    labelsLow
      .attr("x", (d, i) => this.timeScale(i) + this.colW / 2)
      .attr("y", (d, i) => this.h - 5)
      .text((d, i) => this.labelsLow[i]);
  }

  // Get histogram data formatting,
  // excluding those response times under 15 minutes,
  // which will fall under the chat mode buckets
  bucketify (times) {
    let buckets = [
      0, // 15min - 1 h
      0, // 1 - 2 h
      0, // 2 - 4 h
      0, // 4 - 12 h
      0, // 12 - 24 h
      0 // > 24 h
    ];

    for (let i = 0; i < times.length; i++) {
      if (times[i] < 3600001 && times[i] > 900000) {
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
    return buckets;
  }

  // Put data as frequencies in buckets for histogram
  // Only response times under 15 minutes will be included
  bucketify15m (times) {
    let buckets = [
      0, // < 2min
      0, // 2 - 5 min
      0, // 5 - 10 min
      0 // 10 - 15 min
    ];

    for (let i = 0; i < times.length; i++) {
      if (times[i] < 120001) {
        buckets[0]++;
      } else if (times[i] > 120000 && times[i] < 300001) {
        buckets[1]++;
      } else if (times[i] > 300000 && times[i] < 600001) {
        buckets[2]++;
      } else if (times[i] > 600000 && times[i] < 900001) {
        buckets[3]++;
      }
    }
    return buckets;
  }
}
