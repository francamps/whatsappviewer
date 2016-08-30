export default class ResponseTimesTime {
  constructor (el, props) {
    this.w = props.w;
    this.mg = props.mg;
    this.h = 200;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.gold = props.gold;
    this.dayFormat = props.dayFormat;
    this.labelFormat = props.labelFormat;

    this.el = el;

    this.dayFormatParse = d3.timeParse(this.dayFormat);
  }

  render (state) {
    // Append SVG to the DOM
    this.svg =
      d3.select("#" + this.el)
        .append("svg")
        .attr("class", "dailyRT-svg")
        .attr("width", this.w)
        .attr("height", this.h);

    // Color column top, RT
    this.svg.append("g")
        .attr("class", "respsA");
    this.svg.append("g")
        .attr("class", "respsB");

    // Grey background columns, RT
    this.svg.append("g")
      .attr("class", "bars-bg")
    // Individual messages
    this.svg.append("g")
        .attr("class", "message-circles");

    // Silent days
    this.svg.append("g")
        .attr("class", "silences");

    this.update(state);
  }

  update (state) {
    this.computeScaleFns(state.domain);
    this.adjustSizeIfNeeded(state.domain);
    this.addEachResponseTimeColumns(state.data);
    this.addEachResponseTimeLine(state.data);
    this.addSilences(state);
    //this.addMessageDots(state.data);
    this.addAxis();
  }

  updateSVG () {
    d3.select("#" + this.el + ' svg')
      .attr("width", this.w)
      .attr("height", this.h);
  }

  destroy () {
    // Please find a better way to do this
    d3.select('#' + this.el + ' svg')
      .remove();
  }

  // Compute scale functions for x axis (time) and y axis (response time)
  computeScaleFns (domain) {
    this.timeScale =
        d3.scaleTime()
          .domain(domain.time)
          .range([this.mg * 2, this.w - this.mg]);

  	this.yScale =
        d3.scaleLinear()
					.domain([0, 86400000])
					.range([this.h - this.mg, this.mg]);
  }

  getDaysNum (domain) {
    if (this.daysNum) return this.daysNum;

    let dateF = domain.time[1],
        date0 = domain.time[0];

    this.daysNum = Math.floor((dateF - date0) / 86400000);

    return this.daysNum;
  }

  adjustSizeIfNeeded (domain) {
    let daysNum = this.getDaysNum(domain);
    // Minimum width of columns to be perceived well
    let minColW = 20,
        minimumW = minColW * daysNum;

    this.colW = minColW;

    // If width too narrow, make it extend to full width
    if (this.w < minimumW) {
      this.w = minimumW;
      // Update SVG to minimum width
      this.updateSVG();

      // Update the time scale as well
      this.computeScaleFns(domain);

      // Update the column width
      let date0 = domain.time[0],
          date1 = d3.timeDay.offset(date0, 1);

      this.colW = this.timeScale(date1) - this.timeScale(date0);
    }
  }

  addSilences (state) {
    let date0 = state.domain.time[0],
        dateF = state.domain.time[1];

    let silentDays = [];

    for (let i = 0; i < this.getDaysNum(state.domain); i++) {
      if (!state.data.authorA[i] && !state.data.authorB[i]) {
        silentDays.push({datetime: d3.timeDay.offset(date0, i)});
      }
    }

    let silences = this.svg.selectAll(".silences");

    let silence = silences.selectAll(".silentDay")
      .data(silentDays)
      .enter().append("rect")
      .attr("class", "silentDay");

    silence
      .attr("x", (d) => this.timeScale(d.datetime))
      .attr("y", this.mg)
      .attr("width", this.colW)
      .attr("height", this.h - this.mg * 2);

    silence
      .style("fill", "#c0c0c0")
      .style("opacity", .2);
  }

  // Custom line function for path
  lineCustomPath (data) {
    let path = '';
    let xFn = (datetime) => this.timeScale(this.dayFormatParse(datetime));
    for (var i = 0; i < data.length; i++) {
      let d = data[i];
      if (data[i] && i === 0) {
        let x = xFn(d.datetime),
            xF = this.colW,
            y = this.yScale(d.responseTime);
        path += 'M' + x + ' ' + y + ' ' + ' h' + xF;
      } else if (d && i < data.length - 1 && !data[i - 1] && data[i + 1]) {
        let x = xFn(d.datetime),
            y = this.yScale(d.responseTime);
        path += 'M' + x + ' ' + y + ' ';
      } else if (!d && data[i - 1]) {
        let x = xFn(data[i - 1].datetime),
            xF = this.colW,
            y = this.yScale(data[i - 1].responseTime);
        path += 'M' + x + ' '+ y + 'h' + xF + ' ';
      } else if (d && data[i - 1]) {
        let x0 = xFn(data[i - 1].datetime) + this.colW;
        let y0 = this.yScale(d.responseTime);
        path += 'H' + (x0) + ' V' + (y0) + ' ';
      } else if (d && !data[i - 1] && !data[i + 1]) {
        let x = xFn(d.datetime),
            y = this.yScale(d.responseTime);
        path += 'M' + x + ' ' + y + ' H' + x + ' Z ';
      }
    }
    return path;
  }

  addEachResponseTimeLine (data) {
    this.svg.append("path")
      .attr("class", "lineA")
      .attr("d", this.lineCustomPath(data.authorA))
      .style("stroke", this.colorA)
      .style("stroke-width", "2px")
      .style("fill", "none")
      .style("stroke-linecap", "round");

    this.svg.append("path")
      .attr("class", "lineB")
      .attr("d", this.lineCustomPath(data.authorB))
      .style("stroke", this.colorB)
      .style("stroke-width", "2px")
      .style("fill", "none")
      .style("stroke-linecap", "round");
  }

  // Add response times column bar
  addEachResponseTimeColumns (data) {
    let bgs = this.svg.selectAll(".bars-bg");

    // Background
    let bgA = bgs.selectAll(".bgA")
      .data(data.authorA.filter(Boolean))
      .enter().append("rect")
      .attr("class", "bgA")

    // Positioning and sizing
    bgA
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("width",  this.colW)
      .attr("y", (d) => this.yScale(d.responseTime))
      .attr("height", (d) => this.h - this.mg- this.yScale(d.responseTime));

    bgA
      .style("fill", "#c0c0c0")
      .style("opacity", .2);

    // Background
    let bgB = bgs.selectAll(".bgB")
      .data(data.authorB.filter(Boolean))
      .enter().append("rect")
      .attr("class", "bgB")

    // Positioning and sizing
    bgB
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("width",  this.colW)
      .attr("y", (d) => this.yScale(d.responseTime))
      .attr("height", (d) => this.h - this.mg - this.yScale(d.responseTime));

    bgB
      .style("fill", "#c0c0c0")
      .style("opacity", .2);
  }

  // Individual messages dot, to see variance
  addMessageDots (data) {
    let msgs = this.svg.selectAll(".message-circles")

    let allMessagesA = d3.map(data.authorAAll).entries(),
        allMessagesB = d3.map(data.authorBAll).entries();

    let r = 3,
        x = (i) => (i + 5/2) * this.colW;

    // Add messages for author A
    // grouping them per day
    let daysA = msgs.selectAll(".day-message-circles")
      .data(allMessagesA)
      .enter().append("g");

    daysA.each((d, i, nodes) => {
      let circle = d3.select(nodes[i]).selectAll(".message-circle")
        .data(d.value)
        .enter().append("circle")
        .attr("class", "message-circle")

      // Position and dimension
      circle
        .attr("cx", x(i) + 2)
        .attr("cy", (b) => this.yScale(b))
        .attr("r", r)

      // Styling, please move to stylesheet
      circle
        .style("fill", this.colorA);
    });

    // Add messages for author B
    // grouping them per day
    let daysB = msgs.selectAll(".day-message-circles")
      .data(allMessagesB)
      .enter().append("g");

    daysB.each((d, i, nodes) => {
      // A circle per message
      let circle = d3.select(nodes[i]).selectAll(".message-circle")
        .data(d.value)
        .enter().append("circle")
        .attr("class", "message-circle")

      // Position and dimension
      circle
        .attr("cx", x(i) - 2)
        .attr("cy", (b) => this.yScale(b))
        .attr("r", r)

      // Styling, please move to stylesheet
      circle
        .style("fill", this.colorB);
    });

    d3.selectAll(".message-circle")
      .style("stroke-width", "1")
      .style("opacity", .6)
      .style("stroke", "white");
  }

  addAxis () {
    // Over time, horizontal axis
    let axis = d3.axisTop(this.timeScale);

    let midH = this.h;

    let axisTicks = this.svg.append("g")
      .attr("class", "axis-g")
      .attr("transform", 'translate(0, 18)')
      .call(axis);

    axisTicks.selectAll('.axis-g .domain')
      .attr("transform", `translate(0, ${midH - 10})`);

    // Response time axis
    let axisRT = d3.axisLeft(this.yScale)
                    .tickValues([86400000, 3 * 86400000/4, 86400000/2, 86400000/4, 0])
                    .tickSize(this.w - this.mg)
                    .tickFormat((d) => (d / 3600000) + 'h');

    let axisTicksRT = this.svg.append("g")
      .attr("class", "axisRT-g")
      .attr("transform", 'translate(' + this.w + ', 0)')
      .call(axisRT);

    axisTicksRT.selectAll('.axisRT-g .tick line')
      .style("stroke", "#a0a0a0")
      .style("stroke-dasharray", "2px 5px");
    }
}
