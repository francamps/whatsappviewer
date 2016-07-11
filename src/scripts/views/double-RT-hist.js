export default class ResponseTimesHist {
  constructor (el, props) {
    this.w = 400;
    this.mg = props.mg;
    this.h = 180;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.dayFormat = props.dayFormat;
    this.labelFormat = props.labelFormat;
    this.chatMode = props.chatMode;
    this.author = props.author;
    this.el = el;
  }

  viewSizeAdjustments () {
    // Make sure the dimensions are correct for the viewport
    let smallVersion = (document.querySelector(".page-wrap").offsetWidth < 800);
    if (smallVersion) {
      this.w = 100;
      this.mg = 5;
    }
  }

  getBuckets (data) {
    // Buckitfy times on chat mode or not
    // INFO: Chat mode means any response time under 15 minutes
    if (this.chatMode) {
      this.bucketsA = data.authorA;
      this.bucketsB = data.authorB;
    } else {
      this.bucketsA = data.authorA;
      this.bucketsB = data.authorB;
    }
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

  render (data) {
    // Append SVG to div
  	this.svg = d3.select("#" + this.el)
                .append('svg')
                .attr("class", "histoRT-svg")
  							.attr('width', this.w)
  							.attr('height', this.h);

    this.getBuckets(data);
    this.viewTypeAdjustments();
    this.viewSizeAdjustments();

    this.update(data);
  }

  update (data) {
    // Do the thing
    this.computeScaleFns(data);
    this.addBars(data);
    this.addLabels();
  }

  destroy () {
    // Please find a better way to do this
    d3.select("#" + this.el + " svg").remove();
  }

  computeScaleFns (data) {
    // Y axis limits depend on both author A and B
    this.yMax = d3.max([d3.max(this.bucketsA), d3.max(this.bucketsB)]);

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
}
