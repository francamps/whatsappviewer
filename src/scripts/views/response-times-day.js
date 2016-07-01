export default class ResponseTimesTime {
  constructor (args) {
    this.w = args.options.w;
    this.mg = args.options.marginH;
    this.h = args.options.h;
    this.pink = args.options.pink;
    this.purple = args.options.purple;
    this.gold = args.options.gold;
    this.dayFormat = args.options.dayFormat;
    this.labelFormat = args.options.labelFormat;
    this.Convo = args.Convo;

    this.resps = args.Convo.getResponseTimes();
  	this.respsDay = args.Convo.getResponseTimesByAuthorDay();
    this.silences = args.Convo.getSilences();

    this.dayFormatParse = d3.timeParse(this.dayFormat);
  }

  render () {
    this.initializeSVG();

    this.computeScaleFns();
    this.adjustSizeIfNeeded();
    this.addEachResponseTime()
    this.addDiffLine();
    this.addMessageDots();
    this.addAxis();
    //this.addSilences();
  }

  initializeSVG () {
    // Please find a better way to do this
  	d3.select('#widget-3 svg')
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
          .range([this.mg, this.w - this.mg]);

  	this.yScale =
        d3.scaleLinear()
					.domain([0, 86400000])
					.range([0, this.h / 2]);
  }

  adjustSizeIfNeeded () {
    // Minimum width of columns to be perceived well
    let minColW = 10,
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
      .enter().append("rect")
      .attr("class", "lineA respLine")

    // Positioning and sizing
    lineA
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("y", (d) => this.h / 2 - this.yScale(d.responseTime))
      .attr("width", this.colW - 2)
      .attr("height", (d) => this.yScale(d.responseTime));

    // Styling for RT columns
    lineA
			.style("fill", this.pink);

    /* Author B */
    // Add RT for author B, grouped
    let respsB =
        this.svg.append("g")
            .attr("class", "respsA");

    // Append columns per each day with response time daya
    let lineB = respsB.selectAll(".lineB")
      .data(this.respsDay.authorB.filter(Boolean))
      .enter().append("rect")
      .attr("class", "lineB respLine")

    // Positioning and sizing
    lineB
      .attr("x", (d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .attr("y", (d) => this.h / 2)
      .attr("width", this.colW - 2)
      .attr("height", (d) => this.yScale(d.responseTime))

    // Styling, please move to stylesheet
    lineB
  		.style("fill", this.purple);
  }

  // Add difference between each author's response time per day
  addDiffLine () {
    // functions for positioning
    let x = (d) => {
      let parsedDate = this.dayFormatParse(d.datetime);
      return this.timeScale(parsedDate) + this.colW / 2;
    }

    let y = (d) => {
      return this.h / 2 - this.yScale(d.responseTimeDifference);
    }

    // Line function
    let lineFn = d3.line()
      .x(x)
      .y(y)
      .defined((d) => d.responseTimeDifference)
      .curve(d3.curveMonotoneX);

    // Append the line as a path
    let diffLine = this.svg.append("path")
      .attr("class", "diffLine")
      .attr("d", lineFn(this.respsDay.difference))

    // Please move this to a stylesheet
    diffLine
      .style("fill", "none")
      .style("stroke", this.gold);
  }

  // Individual messages dot, to see variance
  addMessageDots () {
    let msgs =
        this.svg.append("g")
            .attr("class", "message-circles");

    let allMessagesA = d3.map(this.respsDay.authorAAll).entries(),
        allMessagesB = d3.map(this.respsDay.authorBAll).entries();

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
        .attr("cx", this.mg + (i + 1/2) * this.colW)
        .attr("cy", (b) => this.h / 2 - this.yScale(b))
        .attr("r", 2)

      // Styling, please move to stylesheet
      circle
        .style("fill", this.pink);
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
        .attr("cx", this.mg + (i + 1/2) * this.colW)
        .attr("cy", (b) => this.h / 2 + this.yScale(b))
        .attr("r", 2)

      // Styling, please move to stylesheet
      circle
        .style("fill", this.purple);
    });

    d3.selectAll(".message-circle")
      .style("stroke-width", "1")
      .style("opacity", .6)
      .style("stroke", "white");
  }

  addAxis () {
    let axis = d3.axisBottom(this.timeScale);

    let midH = this.h / 2;

    this.svg.append("g")
      .attr("class", "axis-g")
      .attr("transform", `translate(0, ${midH})`)
      .call(axis);
  }

  addSilences () {
    // TODO: Do something with the silences at somepoint
  }
}
