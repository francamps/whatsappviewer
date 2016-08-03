'use strict';

import EventEmitter from 'events';

export default class ResponseTimesHist {
  constructor (el, props) {
    this.w = 280;
    this.mg = 50
    this.h = 180;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.dayFormat = props.dayFormat;
    this.labelFormat = props.labelFormat;
    this.chatMode = props.chatMode;
    this.author = props.author;
    this.el = el;
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
      this.labels = ["<2'", "2'-5'", "5'-10'", "10'-15'"];
    } else {
      this.labels = ["15'- 1h", "1-2h", "2-4h", "4-12h", "12-24h", ">24h"];
    }
  }

  render (data) {
    // Append SVG to div
  	this.svg = d3.select("#" + this.el)
                .append('svg')
                .attr("class", "histoRT-svg")
  							.attr('width', this.w)
  							.attr('height', this.h);

    let dispatcher = new EventEmitter();

    this.getBuckets(data);
    this.viewTypeAdjustments();

    this.update(data, dispatcher);

    return dispatcher;
  }

  update (data, dispatcher) {
    // Do the thing
    this.getBuckets(data);
    this.computeScaleFns();
    this.addBars(dispatcher);
    this.addLine();
    this.addLabels();
  }

  destroy () {
    // Please find a better way to do this
    d3.select("#" + this.el + " svg").remove();
  }

  computeScaleFns () {
    // Y axis limits depend on both author A and B
    this.xMax = d3.max([d3.max(this.bucketsA), d3.max(this.bucketsB)]);

    this.timeScale =
      (value) => {
        return value * this.h / this.bucketsA.length;
      }

  	this.xScale =
      d3.scaleLinear()
				.domain([0, this.xMax])
				.range([0, (this.w - this.mg * 2) / 2]);

    // Adjust column width based on type of buckets
    this.colH = this.h / this.bucketsA.length - 6;
  }

  addLine () {
    let midLine = this.svg.append("line")
      .attr("class", ".midLine");

    midLine
      .attr("x1", this.w/2)
      .attr("x2", this.w/2)
      .attr("y1", 0)
      .attr("y2", this.h - 6);

    midLine
      .style("stroke", "#000000")
      .style("stroke-dasharray", "2px 5px");
  }

  // Apend the bars on the histogram
  addBars (dispatcher) {
    let barsHistA = this.svg.selectAll('.barsHistA')
      .data(this.bucketsA)
      .enter().append('rect')
      .attr("class", "barsHistA");

    let barsHistB = this.svg.selectAll('.barsHistB')
      .data(this.bucketsB)
      .enter().append('rect')
      .attr("class", "barsHistB");

    barsHistA
      .attr("x", (d) => this.w / 2 - this.xScale(d))
      .attr("y", (d, i) => this.timeScale(i))
      .attr("width", (d, i) => this.xScale(d))
      .attr("height", this.colH);

    barsHistB
      .attr("x", (d, i) => this.w / 2)
      .attr("y", (d, i) => this.timeScale(i))
      .attr("width", (d, i) => this.xScale(d))
      .attr("height", this.colH);

    barsHistA
      .style("fill", this.colorA)
      .style("opacity", .3);

    barsHistB
      .style("fill", this.colorB)
      .style("opacity", .3);

    barsHistA
      .on("mouseover", (d, i) => {
        dispatcher.emit("barsHist:mouseover", d, i, 'A');
      })
      .on("mouseout", (d, i) => {
        dispatcher.emit("barsHist:mouseout", d, i, 'A');
      });

    barsHistB
      .on("mouseover", (d, i) => {
        dispatcher.emit("barsHist:mouseover", d, i, 'B');
      })
      .on("mouseout", (d, i) => {
        dispatcher.emit("barsHist:mouseout", d, i, 'B');
      });

    let barsHistAtop = this.svg.selectAll('.barsHistAtop')
      .data(this.bucketsA)
      .enter().append('rect')
      .attr("class", "barsHistAtop barsHistTop");

    let barsHistBtop = this.svg.selectAll('.barsHistBtop')
      .data(this.bucketsB)
      .enter().append('rect')
      .attr("class", "barsHistBtop barsHistTop");

    barsHistAtop
      .attr("x", (d) => this.w / 2 - this.xScale(d))
      .attr("y", (d, i) => this.timeScale(i))
      .attr("width", 6)
      .attr("height", this.colH)
      .style("fill", this.colorA)
      .on("mouseover", (d, i) => {
        dispatcher.emit("barsHist:mouseover", d, i, 'A');
      })
      .on("mouseout", (d, i) => {
        dispatcher.emit("barsHist:mouseout", d, i, 'A');
      });

    barsHistBtop
      .attr("x", (d, i) => this.w / 2 + this.xScale(d))
      .attr("y", (d, i) => this.timeScale(i))
      .attr("width", 6)
      .attr("height", this.colH)
      .style("fill", this.colorB)
      .on("mouseover", (d, i) => {
        dispatcher.emit("barsHist:mouseover", d, i, 'B');
      })
      .on("mouseout", (d, i) => {
        dispatcher.emit("barsHist:mouseout", d, i, 'B');
      });
  }

  // Add time buckets labels
  addLabels () {
    // First row of labels
    let labelsHigh = this.svg.selectAll(".labelHigh")
      .data(this.labels)
      .enter().append("text")
      .attr("class", "labelHigh label");

    labelsHigh
      .attr("x", (d, i) => 40)
      .attr("y", (d, i) => this.timeScale(i) + this.colH / 2)
      .text((d, i) => this.labels[i]);
  }
}
