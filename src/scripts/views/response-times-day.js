export default class ResponseTimesTime {
  constructor (args) {
    this.w = args.options.w;
    this.mg = args.options.mg;
    this.h = args.options.h;
    this.colorA = args.options.colorA;
    this.colorB = args.options.colorB;
    this.gold = args.options.gold;
    this.dayFormat = args.options.dayFormat;
    this.labelFormat = args.options.labelFormat;
    this.Convo = args.Convo;

  	this.respsDay = args.Convo.getResponseTimesByAuthorDay();

    this.dayFormatParse = d3.timeParse(this.dayFormat);
  }

  render () {
    this.initializeSVG();

    this.computeScaleFns();
    this.adjustSizeIfNeeded();
    this.addEachResponseTime()
    this.addEachResponseTimeColumns();
    this.addSilences();
    this.addAxis();
  }

  initializeSVG () {
    // Please find a better way to do this
  	d3.select('#widget-3 .svg svg')
      .remove();

    // Append SVG to the DOM
  	this.svg =
      d3.select("#widget-3 .svg")
        .append("svg")
        .attr("class", "dailyRT-svg")
  			.attr("width", this.w)
  			.attr("height", this.h);
  }

  // Compute scale functions for x axis (time) and y axis (response time)
  computeScaleFns () {
    this.timeScale =
        d3.scaleTime()
          .domain([this.Convo.date0, this.Convo.dateF])
          .range([0, this.w]);

  	this.yScale =
        d3.scaleLinear()
					.domain([0, 86400000])
					.range([0, this.h / 2]);
  }

  adjustSizeIfNeeded () {
    // Minimum width of columns to be perceived well
    let minColW = 20,
        minimumW = minColW * this.Convo.daysNum;

    this.colW = minColW;

    // If width too narrow, make it extend to full width
    if (this.w < minimumW) {
      this.w = minimumW;
      // Update SVG to minimum width
      this.initializeSVG();

      // Update the time scale as well
      this.computeScaleFns();

      // Update the column width
      let date0 = this.Convo.date0,
          date1 = d3.timeDay.offset(this.Convo.date0, 1);

      this.colW = this.timeScale(date1) - this.timeScale(date0);
    }
  }

  addSilences () {
    let date0 = this.Convo.date0,
        dateF = this.Convo.dateF;

    let silentDays = [];

    for (let i = 0; i < this.Convo.daysNum; i++) {
      if (!this.respsDay.authorA[i] && !this.respsDay.authorB[i]) {
        silentDays.push({datetime: d3.timeDay.offset(date0, i)});
      }
    }

    let silences = this.svg.append("g")
                      .attr("class", "silences");

    let silence = silences.selectAll(".silentDay")
      .data(silentDays)
      .enter().append("rect")
      .attr("class", "silentDay");

    silence
      .attr("x", (d) => this.timeScale(d.datetime))
      .attr("y", 0)
      .attr("width", this.colW)
      .attr("height", this.h);

    silence
      .style("fill", "#c0c0c0")
      .style("opacity", .1);
  }

  // Add response times column bar
  addEachResponseTime () {
    /* Author A */
    // Add RT for author A, grouped
    let respsA =
        this.svg.append("g")
            .attr("class", "respsA");

    // Append columns per each day with response time daya
    let lineA = respsA.selectAll(".lineA")
      .data(this.respsDay.authorA.filter(Boolean))
      .enter().append("line")
      .attr("class", "lineA respLine")

    // Positioning and sizing
    lineA
      .attr("x1", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("x2",  (d) => this.timeScale(this.dayFormatParse(d.datetime)) + this.colW)
      .attr("y1", (d) => this.h / 2 - this.yScale(d.responseTime))
      .attr("y2", (d) => this.h / 2 - this.yScale(d.responseTime));

    // Styling for RT columns
    lineA
      .style("opacity", .8)
			.style("stroke", this.colorA)
      .style("stroke-width", "4px");

    /* Author B */
    // Add RT for author B, grouped
    let respsB =
        this.svg.append("g")
            .attr("class", "respsB");

    // Append columns per each day with response time daya
    let lineB = respsB.selectAll(".lineB")
      .data(this.respsDay.authorB.filter(Boolean))
      .enter().append("line")
      .attr("class", "lineB respLine")

    // Positioning and sizing
    lineB
      .attr("x1", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("x2",  (d) => this.timeScale(this.dayFormatParse(d.datetime)) + this.colW)
      .attr("y1", (d) => this.h / 2 + this.yScale(d.responseTime))
      .attr("y2", (d) => this.h / 2 + this.yScale(d.responseTime));

    // Styling for RT columns
    lineB
      .style("opacity", .8)
      .style("stroke", this.colorB)
      .style("stroke-width", "4px");
  }

  // Add response times column bar
  addEachResponseTimeColumns () {
    // Background
    let bgA = this.svg.selectAll(".bgA")
      .data(this.respsDay.authorA.filter(Boolean))
      .enter().append("rect")
      .attr("class", "bgA")

    // Positioning and sizing
    bgA
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("width",  this.colW)
      .attr("y", (d) => this.h / 2 - this.yScale(d.responseTime))
      .attr("height", (d) => this.yScale(d.responseTime));

    bgA
      .style("fill", "#c0c0c0")
      .style("opacity", .1);

    // Background
    let bgB = this.svg.selectAll(".bgB")
      .data(this.respsDay.authorB.filter(Boolean))
      .enter().append("rect")
      .attr("class", "bgB")

    // Positioning and sizing
    bgB
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("width",  this.colW)
      .attr("y", (d) => this.h / 2)
      .attr("height", (d) => this.yScale(d.responseTime));

    bgB
      .style("fill", "#c0c0c0")
      .style("opacity", .1);
  }

  // Individual messages dot, to see variance
  addMessageDots () {
    let msgs =
        this.svg.append("g")
            .attr("class", "message-circles");

    let allMessagesA = d3.map(this.respsDay.authorAAll).entries(),
        allMessagesB = d3.map(this.respsDay.authorBAll).entries();

    let r = 2,
        x = (i) => (i + 1/2) * this.colW - 1;

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
        .attr("cx", x(i))
        .attr("cy", (b) => this.h / 2 - this.yScale(b))
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
        .attr("cx", x(i))
        .attr("cy", (b) => this.h / 2 + this.yScale(b))
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
    let axis = d3.axisBottom(this.timeScale);

    let midH = this.h / 2;

    let axisTicks = this.svg.append("g")
      .attr("class", "axis-g")
      .attr("transform", 'translate(0, 10)')
      .call(axis);

    axisTicks.selectAll('.axis-g .domain')
      .attr("transform", `translate(0, ${midH - 10})`);
  }
}
