'use strict';

import EventEmitter from 'events';

export default class DayOfWeek {
  constructor (el, props) {
    this.w = props.w;
    this.h = 150;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.rMax = 30;
    this.mg = 30;
    this.weekdayStep = (this.w - this.mg) / 7;

    this.el = el;
  }

  render (state) {
    this.destroy();

    // Append SVG to div
    this.svg = d3.select('#' + this.el)
                .append('svg')
                .attr('class', 'day-of-week-svg')
                .attr('width', this.w)
                .attr('height', this.h);

    // Groups of bubbles
    let bubbles = this.svg.append("g")
                      .attr("class", "weekday-bubbles");

    bubbles.append("g")
        .attr("class", "weekday-bubblesA");

    bubbles.append("g")
      .attr("class", "weekday-bubblesB");

    this.svg
        .append("g")
        .attr("class", "weekday-labels");

    let dispatcher = new EventEmitter();

    this.update(state, dispatcher);

    return dispatcher;
  }

  update (state, dispatcher) {
    // Get response times
    let days = state.data;

    this.daysA = days.authorAweekdays;
    this.daysB = days.authorBweekdays;

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
    this.maxA = d3.max(this.daysA),
    this.maxB = d3.max(this.daysB);

    // Define scale functions
    this.rScale = d3.scalePow().exponent(.5)
                  .domain([0, d3.max([this.maxA, this.maxB])])
                  .range([1, this.rMax]);
  }

  addBubbles (dispatcher) {
    // Groups of bubbles
    let bubbles = d3.selectAll(".weekday-bubbles");

    let bubblesA = bubbles.selectAll(".weekday-bubblesA");

    let bubblesB = bubbles.selectAll(".weekday-bubblesB");

    // Add bubbles and their classes
    bubblesA.selectAll(".bubbleA")
      .data(this.daysA)
      .enter().append("circle")
      .attr("class", "bubbleA bubble")

    bubblesB.selectAll(".bubbleB")
      .data(this.daysB)
      .enter().append("circle")
      .attr("class", "bubbleB bubble");

    // Position and size bubbles within each group
    bubbles.selectAll(".bubble")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => this.rScale(d))

    bubblesA.selectAll(".bubbleA")
      .attr("transform", (d, i) => {
        let x = this.mg + i * this.weekdayStep,
            y = this.rMax;
        return `translate(${x}, ${y})`;
      });

    bubblesB.selectAll(".bubbleB")
      .attr("transform", (d, i) => {
        let x = this.mg + i * this.weekdayStep,
            y = this.rScale(this.maxA) + 70;
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

    bubbles
      .style("transform", "translate(" + this.weekdayStep/2 + ",0)")
  }

  renderTimeLabels () {
    let weekdayLabels = d3.selectAll(".weekday-labels");

    let weekdayLabel = weekdayLabels.selectAll(".weekday-label")
      .data(new Array(7))
      .enter().append("text")
      .attr("class", "weekday-label")
      .style("transform", "translate(" + this.weekdayStep/2 + ",0)");

      let weekdaysIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    weekdayLabel
      .text((d, i) => weekdaysIndex[i]);

    weekdayLabel
      .attr("x", (d, i) => (this.mg + i * this.weekdayStep))
      .attr("y", this.rMax + 40)
      .style("text-anchor", "middle")
      .style("text-transform", "uppercase");
  }
}
