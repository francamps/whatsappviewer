export default class VolumeTime {
  constructor (args) {
    this.args = args;
    this.w = args.options.w;
    this.mg = args.options.mg || 20;
    this.h = args.options.h;
    this.pink = args.options.pink;
    this.purple = args.options.purple;
    this.dayFormat = args.options.dayFormat;
    this.labelFormat = args.options.labelFormat;
    this.Convo = args.Convo;
    this.chars = this.Convo.getCharactersByAuthorAndDay();
  }

  render () {
    // Please don't do this...
    d3.select('#graph-viewer svg').remove();

    // Append SVG do the div
    this.svg = d3.select('#graph-viewer')
                .append('svg')
                .attr('width', this.w)
                .attr('height', this.h);

    this.timeScale = d3.scaleTime()
                      .domain([this.Convo.date0, this.Convo.dateF])
                      .range([this.mg, this.w - this.mg]);

    let allChars = this.chars.authorA.concat(this.chars.authorB);
    let maxChar = d3.max(allChars, (d) => d.chars );

    this.charScale = d3.scaleLinear()
                      .domain([0, maxChar])
                      .range([this.h / 2, 0]);

    let parseFn = d3.timeParse(this.dayFormat);

    let lineFunction = d3.area()
      .x((d) => this.timeScale(parseFn(d.datetime)))
      .y0((d) => this.charScale(d.chars))
      .y1((d) => this.charScale(0))
      .curve(d3.curveBasis);

    let lineFunction2 = d3.area()
      .x((d) => this.timeScale(parseFn(d.datetime)))
      .y0((d) => this.charScale(-d.chars))
      .y1((d) => this.charScale(0))
      .curve(d3.curveBasis);

    let lineA = this.svg.append("path")
      .attr("d", lineFunction(this.chars.authorA))
      .attr("fill", this.pink);

    let lineB = this.svg.append("path")
      .attr("d", lineFunction2(this.chars.authorB))
      .attr("fill", this.purple);

    this.svg.append("text")
      .attr("class", "time-label")
      .attr("x", this.mg)
      .attr("y", this.h / 4)
      .style("text-anchor", "start")
      .text(this.labelFormat(this.Convo.date0));

    this.svg.append("text")
      .attr("class", "time-label")
      .attr("x", this.timeScale(this.Convo.dateF))
      .attr("y", this.h / 4)
      .style("text-anchor", "end")
      .text(this.labelFormat(this.Convo.dateF));

    this.svg.append("line")
      .attr("class", "tick")
      .attr("x1", this.mg)
      .attr("y1", this.h / 4 + 10)
      .attr("x2", this.mg)
      .attr("y2", this.h / 4 + 60);

    this.svg.append("line")
      .attr("class", "tick")
      .attr("x1", this.timeScale(this.Convo.dateF))
      .attr("y1", this.h / 4 + 10)
      .attr("x2", this.timeScale(this.Convo.dateF))
      .attr("y2", this.h / 4 + 60);
  }

  // Flag days where those messages are sent
	displaySomeMessages (messages) {
    let svg = this.svg,
				timeScale = this.timeScale,
				charScale = this.charScale,
        dayFormat = this.dayFormat,
        purple = this.purple,
        h = this.h;

    if (messages.length > 0) {
      let date0 = this.dayFormat.parse(messages[0].datetime),
          date1 = d3.timeDay.offset(date0, 1),
          width = timeScale(date1) - timeScale(date0);
    }

		if (svg) {
			svg.selectAll('.selected-msg').remove();
			svg.selectAll('.selected-msg')
				.data(messages)
				.enter().append('rect')
				.attr('class', 'selected-msg')
				.attr('x', (d) => timeScale(dayFormat.parse(d.datetime)) - width / 2)
				.attr('y', 0)
				.attr('width', width)
				.attr('height', h)
				.style('fill', purple)
				.style('opacity', .2);
		}
	}

  /*
	Events on the dashboard
	*/

	addEvents (messages) {
		let searchForm = document.getElementById("search-form");
		searchForm.addEventListener('submit', (e) => e.preventDefault());

		let searchBox = document.getElementById("search-box");
		searchBox.addEventListener('keypress',
      this.searchText.bind(this, searchBox, messages));
	}

  searchText (searchBox, messages, e) {
    if (e.keyCode === 13 && searchBox.value.length > 0){
      let toDisplay = [],
          valueRE = new RegExp("(" + searchBox.value + ")");

      for (var i = 0; i < messages.length; i++) {
      	if (messages[i].text.search(valueRE) !== -1) {
      		toDisplay.push(messages[i]);
      	};
      }

      this.displaySomeMessages(toDisplay);
      document.getElementById("search-box").blur()
    }
    return false;
  }
}
