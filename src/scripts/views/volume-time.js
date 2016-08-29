'use strict';

import EventEmitter from 'events';

export default class VolumeTime {
  constructor (el, props) {
    this.w = props.w;
    this.mg = 40;
    this.h = props.h;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.dayFormat = props.dayFormat;
    this.labelFormat = props.labelFormat;

    this.el = el;

    this.dayFormatParse = d3.timeParse(this.dayFormat);
  }

  render (state) {
    // Append SVG do the div
    this.svg = d3.select('#' + this.el)
                .append('svg')
                .attr("class", "words-time-svg")
                .attr('width', this.w)
                .attr('height', this.h);

    // Lines
    this.svg.append("path")
        .attr("class", "lineA");

    this.svg.append("path")
        .attr("class", "lineB");

    // Axis
    this.svg.append("g")
        .attr("class", "axis-g");

    // Max
    this.svg.append("g")
        .attr("class", "max-words");

    // Add hoverable
    this.svg.append("g")
        .attr("class", "hoverables");

    let dispatcher = new EventEmitter();

    // Infuse data
    this.messages = state.messages;
    this.update(state, dispatcher);

    return dispatcher;
  }

  update (state, dispatcher) {
    this.computeScaleFns(state);
    this.addLines(state);
    this.addAxis();
    this.addHoverables(state, dispatcher);
    this.addMaxWords(state);
    //this.addSearchFunctionality();
  }

  destroy () {
    // TO DO: WTF
    d3.select('#' + this.el + ' svg').remove();
  }

  computeScaleFns (state) {
    let maxWords = this.getMaxNumWords(state.data);

    // X axis -> time scale
    this.timeScale =
      d3.scaleTime()
        .domain(state.domain.time)
        .range([0, this.w]);

    // Y axis -> Number of words
    this.wordScale =
      d3.scaleLinear()
        .domain([0, maxWords])
        .range([this.h / 2, this.mg]);
  }

  // Add areas
  addLines (state) {
    let lineFunctionA = d3.area()
      .x((d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .y0((d) => this.wordScale(d.words))
      .y1((d) => this.wordScale(0))
      .curve(d3.curveMonotoneX);

    let lineFunctionB = d3.area()
      .x((d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .y0((d) => this.wordScale(-d.words))
      .y1((d) => this.wordScale(0))
      .curve(d3.curveMonotoneX);

    let lineA = d3.selectAll(".lineA")
      .attr("d", lineFunctionA(state.data.authorA))
      .attr("fill", this.colorA);

    let lineB = d3.selectAll(".lineB")
      .attr("d", lineFunctionB(state.data.authorB))
      .attr("fill", this.colorB);
  }

  addHoverables (state, dispatcher) {
    let hoverables = d3.selectAll(".hoverables");

    hoverables.selectAll(".hoverableA")
      .data(state.data.authorA)
      .enter().append("rect")
      .attr("class", "hoverableA")
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)) - 2)
      .attr("y", this.mg)
      .attr("height", this.h / 2 - this.mg)
      .attr("width", 5);

    hoverables.selectAll(".hoverableB")
      .data(state.data.authorB)
      .enter().append("rect")
      .attr("class", "hoverableB")
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)) - 2)
      .attr("y", this.h / 2)
      .attr("height", this.h / 2 - this.mg)
      .attr("width", 5);

    hoverables.selectAll(".hoverableA")
      .on("mouseover", (d, i) => { dispatcher.emit('hoverable:mouseover', d, i, 'A')})
      .on("mouseout", (d, i) => { dispatcher.emit('hoverable:mouseout', d, i, 'A')});

    hoverables.selectAll(".hoverableB")
      .on("mouseover", (d, i) => { dispatcher.emit('hoverable:mouseover', d, i, 'B')})
      .on("mouseout", (d, i) => { dispatcher.emit('hoverable:mouseout', d, i, 'B')});
  }

  getDayWidth () {
    let date0 = d3.timeParse(this.dayFormat)(this.messages[0].datetime),
        date1 = d3.timeDay.offset(date0, 1);

    return this.timeScale(date1) - this.timeScale(date0);
  }

  getMaxNumWords (data) {
    let allWords = data.authorA.concat(data.authorB);

    return d3.max(allWords, (d) => d.words );
  }

  addAxis () {
    let axis = d3.axisBottom(this.timeScale)
                  .ticks(5);

    let midH = this.h / 2;

    let axisTicks = d3.selectAll(".axis-g")
      .attr("transform", 'translate(0, 0)')
      .call(axis);

    axisTicks.selectAll('.axis-g .domain')
      .style("stroke", "none");
  }

  addMaxWords (state) {
    let data = state.data;

    let getMax = (data) => {
      let max = 0;
      let obj;
      for (var d of data) {
        if (d.words > max) {
          max = d.words;
          obj = d;
        }
      }
      return obj;
    }

    let maxA = getMax(data.authorA);
    let maxB = getMax(data.authorB);

    let maxWords = d3.selectAll(".max-words");

    let circle = maxWords
                  .append("circle")
                  .attr("class", "max-label");

    let max = (maxA.words > maxB.words) ? maxA : maxB;

    circle
      .attr("cx", this.timeScale(this.dayFormatParse(max.datetime)))
      .attr("r", 5)
      .style("stroke", "#d0d0d0")
      .style("stroke-width", 1)
      .style("fill", "none");

    let label = maxWords
          .append("text")
          .text(max.words)
          .attr("x", this.timeScale(this.dayFormatParse(max.datetime)))
          .style("text-anchor", "middle")
          .style("font-size", "10px");

    if (maxA.words > maxB.words) {
      circle.attr("cy", this.wordScale(max.words));
      label.attr("y", this.wordScale(max.words) - 7);
    } else {
      circle.attr("cy", this.wordScale(-max.words));
      label.attr("y", this.wordScale(-max.words) + 15);
    }
  }
}
