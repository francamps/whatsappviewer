'use strict';

import EventEmitter from 'events';

export default class TimeOfDay {
  constructor (el, props) {
    this.w = props.w;
    this.h = 140;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.r = 20;
    this.mg = 30;
    this.hourStep = (this.w - this.mg) / 24;

    this.el = el;
  }

  render (state) {
    this.destroy();

    // Append SVG to div
    this.svg = d3.select('#' + this.el)
                .append('svg')
                .attr('class', 'timeOfDay-svg')
                .attr('width', this.w)
                .attr('height', this.h);

    // Groups of bubbles
    let bubbles = this.svg.append("g")
                      .attr("class", "bubbles");

    bubbles.append("g")
        .attr("class", "bubblesA");

    bubbles.append("g")
      .attr("class", "bubblesB");

    this.svg
        .append("g")
        .attr("class", "time-labels");

    let dispatcher = new EventEmitter();

    this.update(state, dispatcher);

    return dispatcher;
  }

  update (state, dispatcher) {
    // Get response times
    let times = state.data;

    this.timesA = times.authorATimes;
    this.timesB = times.authorBTimes;

    this.computeScaleFns();
    this.addBubbles(dispatcher);
    this.renderTimeLabels();
  }

  destroy () {
    // Make sure there is not one already
    // TODO: This is dirty, fix it
    d3.select('#' + this.el + ' svg').remove();
  }

  computeScaleFns () {
    this.maxA = d3.max(this.timesA),
    this.maxB = d3.max(this.timesB);

    // Define scale functions
    this.rScale = d3.scalePow().exponent(.5)
                  .domain([0, d3.max([this.maxA, this.maxB])])
                  .range([1, 15]);
  }

  addBubbles (dispatcher) {
    // Groups of bubbles
    let bubbles = d3.selectAll(".bubbles");

    let bubblesA = bubbles.selectAll(".bubblesA");

    let bubblesB = bubbles.selectAll(".bubblesB");

    // Add bubbles and their classes
    bubblesA.selectAll(".bubbleA")
      .data(this.timesA)
      .enter().append("circle")
      .attr("class", "bubbleA bubble")

    bubblesB.selectAll(".bubbleB")
      .data(this.timesB)
      .enter().append("circle")
      .attr("class", "bubbleB bubble");

    // Position and size bubbles within each group
    bubbles.selectAll(".bubble")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => this.rScale(d))

    bubblesA.selectAll(".bubbleA")
      .attr("transform", (d, i) => {
        let x = this.mg + i * this.hourStep,
            y = this.h / 4;
        return `translate(${x}, ${y})`;
      });

    bubblesB.selectAll(".bubbleB")
      .attr("transform", (d, i) => {
        let x = this.mg + i * this.hourStep,
            y = 3 * this.h / 4;
        return `translate(${x}, ${y})`;
      });

    // Paint bubbles
    bubblesA.selectAll(".bubbleA")
      .style("fill", this.colorA);

    bubblesB.selectAll(".bubbleB")
      .style("fill", this.colorB);

    // Event
    bubblesA.selectAll(".bubbleA")
      .on("mouseover", (d, i) => { dispatcher.emit('bubble:mouseover', d, i, 'A')})
      .on("mouseout", (d, i) => { dispatcher.emit('bubble:mouseout', d, i, 'A')});

    bubblesB.selectAll(".bubbleB")
      .on("mouseover", (d, i) => { dispatcher.emit('bubble:mouseover', d, i, 'B')})
      .on("mouseout", (d, i) => { dispatcher.emit('bubble:mouseout', d, i, 'B')});
  }

  renderTimeLabels () {
    let timeLabels = d3.selectAll(".time-labels");

    let timeLabel = timeLabels.selectAll(".time-label")
      .data(new Array(24))
      .enter().append("text")
      .attr("class", "time-label")

    timeLabel
      .text((d, i) => {
        // If there is room, display labels every 1 h
        if (this.w > 600 || (i % 2 === 0)) {
          return i + "h";
        }
        // Otherwise, display every 2 hours
        return "";
      });

    timeLabel
      .attr("x", (d, i) => (this.mg + i * this.hourStep))
      .attr("y", this.h / 2 + 5)
      .style("text-anchor", "middle");
  }
}
