export default class TimeOfDay {
  constructor (args) {
    this.w = args.options.w;
    this.h = 140;
    this.pink = args.options.pink;
    this.purple = args.options.purple;
    this.r = 20;
    this.mg = 30;
    this.hourStep = (this.w - this.mg) / 24;

    // Get response times
    let messageTimes = args.Convo.getMessageTimes();

    this.messageTimesA = messageTimes.authorATimes;
    this.messageTimesB = messageTimes.authorBTimes;
  }

  render () {
    // Make sure there is not one already
    // TODO: This is dirty, fix it
    d3.select('#widget-2 .svg svg').remove();

    // Append SVG to div
    this.svg = d3.select('#widget-2 .svg')
                .append('svg')
                .attr('width', this.w)
                .attr('height', this.h);

    this.computeScaleFns();
    this.addBubbles();
    this.renderTimeLabels();
  }

  computeScaleFns () {
    this.maxA = d3.max(this.messageTimesA),
    this.maxB = d3.max(this.messageTimesB);

    // Define scale functions
    this.rScale = d3.scalePow().exponent(.5)
                  .domain([0, this.maxA])
                  .range([1, 15]);

    this.cScale = d3.scalePow().exponent(.5)
                  .domain([0, this.maxB])
                  .range([.2, .6]);
  }

  addBubbles () {
    // Groups of bubbles
    let bubbles = this.svg.append("g")
                      .attr("class", "bubbles");

    let bubblesA = bubbles.append("g")
        .attr("class", "bubblesA");

    let bubblesB = bubbles.append("g")
      .attr("class", "bubblesB");

    // Add bubbles and their classes
    bubblesA.selectAll(".bubbleA")
        .data(this.messageTimesA)
        .enter().append("circle")
        .attr("class", "bubbleA bubble")

    bubblesB.selectAll(".bubbleB")
      .data(this.messageTimesB)
      .enter().append("circle")
      .attr("class", "bubbleB bubble");

    // Position and size bubbles within each group
    bubbles.selectAll(".bubble")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => this.rScale(d));

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
      .style("fill", (d) => d3.hsl(265, .97, this.cScale(d)).toString());

    bubblesB.selectAll(".bubbleB")
      .style("fill", (d) => d3.hsl(338, .95, this.cScale(d)).toString());
  }

  renderTimeLabels () {
    let timeLabels =
        this.svg
            .append("g")
            .attr("class", "time-labels");

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
