export default class ComparisonBar {
  constructor (el, props) {
    this.w = 250;
    this.h = 40;
    this.colorA = props.colorA;
    this.colorB = props.colorB;
    this.r = 20;
    this.mg = 50;
    this.hourStep = (this.w - this.mg) / 24;
    this.decimalNum = props.decimalNum;

    this.el = el
  }

  render (data) {
    // Make sure there is not one already
    // TODO: This is dirty, fix it
    d3.select('#' + this.el + ' svg').remove();

    // Append SVG to div
    this.svg = d3.select('#' + this.el)
                .append('svg')
                .attr('width', this.w)
                .attr('height', this.h);

    this.update(data);
  }

  update (data) {
    this.computeScaleFns(data);
    this.addBars(data);
    this.addLabels(data);
  }

  computeScaleFns (data) {
    let dataMax = d3.max([data.authorA, data.authorB]);

  	this.xScale =
      d3.scaleLinear()
				.domain([0, dataMax])
				.range([this.mg, this.w - this.mg * 2]);

    this.yScale = (i) => { return 15 + i * this.colW; }

    // Adjust column width based on type of buckets
    this.colW = 15;
  }

  // Apend the bars on the histogram
  addBars (data) {
    let barsHist = this.svg.selectAll('.compBar')
      .data([data.authorA, data.authorB])
      .enter().append('rect')
      .attr("class", "compBar");

    barsHist
      .attr("x", (d, i) => this.xScale(0))
      .attr("y", (d, i) => this.yScale(i))
      .attr("width",  (d, i) => this.xScale(d))
      .attr("height", 8)

    barsHist
      .style("fill", (d, i) => {
        if (i === 0) return this.colorA;
        return this.colorB;
      });

    let bubbs = this.svg.selectAll('.compBubbs')
      .data([data.authorA, data.authorB])
      .enter().append('circle')
      .attr("class", "compBubbs");

    bubbs
      .attr("cx", (d, i) => this.mg + this.xScale(d, i))
      .attr("cy", (d, i) => this.yScale(i) + 4)
      .attr("r", 4)

    bubbs
      .style("fill", (d, i) => {
        if (i === 0) return this.colorA;
        return this.colorB;
      });
  }

  addLabels (data) {
    let label = this.svg.selectAll(".label")
      .data([data.authorA, data.authorB])
      .enter().append('text')

    label
      .attr("x", (d, i) => 0)
      .attr("y", (d, i) => this.yScale(i) + 9)
      .text((d) => d.toFixed(this.decimalNum))
      .style("text-anchor", "start")
      .style("font-size", "12px");
  }
}
