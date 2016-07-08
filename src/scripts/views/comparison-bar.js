export default class ComparisonBar {
  constructor (args, svgID, data) {
    this.w = 400;
    this.h = 50;
    this.colorA = args.options.colorA;
    this.colorB = args.options.colorB;
    this.r = 20;
    this.mg = 30;
    this.hourStep = (this.w - this.mg) / 24;
    this.svgID = svgID;

    this.data = data;
  }

  render () {
    // Make sure there is not one already
    // TODO: This is dirty, fix it
    d3.select('#' + this.svgID + ' .svg svg').remove();

    // Append SVG to div
    this.svg = d3.select('#' + this.svgID + ' .svg')
                .append('svg')
                .attr('width', this.w)
                .attr('height', this.h);

    this.computeScaleFns();
    this.addBars();
    this.addLabels();
  }

  computeScaleFns () {
    let dataMax = d3.max([this.data.authorA, this.data.authorB]);

  	this.xScale =
      d3.scaleLinear()
				.domain([0, dataMax])
				.range([0, this.w - 100]);

    this.yScale = (i) => { return this.h / 4 + i * this.colW; }

    // Adjust column width based on type of buckets
    this.colW = 15;
  }

  // Apend the bars on the histogram
  addBars () {
    let barsHist = this.svg.selectAll('.compBar')
      .data([this.data.authorA, this.data.authorB])
      .enter().append('rect')
      .attr("class", "compBar");

    barsHist
      .attr("x", (d, i) => 0)
      .attr("y", (d, i) => this.yScale(i))
      .attr("width",  (d, i) => this.xScale(d))
      .attr("height", 2)

    barsHist
      .style("fill", (d, i) => {
        if (i === 0) return this.colorA;
        return this.colorB;
      });

    let bubbs = this.svg.selectAll('.compBubbs')
      .data([this.data.authorA, this.data.authorB])
      .enter().append('circle')
      .attr("class", "compBubbs");

    bubbs
      .attr("cx", (d, i) => this.xScale(d, i))
      .attr("cy", (d, i) => this.yScale(i))
      .attr("r", 4)

    bubbs
      .style("fill", (d, i) => {
        if (i === 0) return this.colorA;
        return this.colorB;
      });
  }

  addLabels () {
    let label = this.svg.selectAll(".label")
      .data([this.data.authorA, this.data.authorB])
      .enter().append('text')

    label
      .attr("x", (d, i) => this.w)
      .attr("y", (d, i) => this.yScale(i) + 5)
      .text((d) => d.toFixed(2))
      .style("text-anchor", "end")
      .style("font-size", "12px");
  }
}
