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
    this.messages = args.Convo.getMessages();
    this.dayFormatParse = d3.timeParse(this.dayFormat);
  }

  render () {
    // TO DO: WTF
    d3.select('#graph-viewer svg').remove();

    // Append SVG do the div
    this.svg = d3.select('#graph-viewer .svg')
                .append('svg')
                .attr('width', this.w)
                .attr('height', this.h);

    this.computeScaleFns();
    this.addLines();
    //this.addTimeLabelAxis();
    this.addSearchFunctionality();
  }

  computeScaleFns () {
    let maxChar = this.getMaxNumChars();

    // X axis -> time scale
    this.timeScale =
      d3.scaleTime()
        .domain([this.Convo.date0, this.Convo.dateF])
        .range([this.mg, this.w - this.mg]);

    // Y axis -> Number of characters
    this.charScale =
      d3.scaleLinear()
        .domain([0, maxChar])
        .range([this.h / 2, 0]);
  }

  // Add areas
  addLines () {
    let lineFunctionA = d3.area()
      .x((d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .y0((d) => this.charScale(d.chars))
      .y1((d) => this.charScale(0))
      .curve(d3.curveBasis);

    let lineFunctionB = d3.area()
      .x((d) => this.timeScale(this.dayFormatParse(d.datetime)))
      .y0((d) => this.charScale(-d.chars))
      .y1((d) => this.charScale(0))
      .curve(d3.curveBasis);

    let lineA = this.svg.append("path")
      .attr("class", "lineA")
      .attr("d", lineFunctionA(this.chars.authorA))
      .attr("fill", this.pink);

    let lineB = this.svg.append("path")
      .attr("class", "lineB")
      .attr("d", lineFunctionB(this.chars.authorB))
      .attr("fill", this.purple);
  }

  // Add time labels and axis
  // TODO: Review and rethink this
  addTimeLabelAxis () {
    // Timelabels
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

    // Ticks
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

  /*
	Search utilities on the dashboard
	*/

	addSearchFunctionality () {
		let searchForm = document.getElementById("search-form"),
        searchBox = document.getElementById("search-box");

    // Do not fire the form itself
		searchForm.addEventListener('submit', (e) => e.preventDefault());

    // Search it
		searchBox.addEventListener('keypress', (e) => {
      // Get the query value in the input field
      let searchBoxQuery = searchBox.value;

      // Search for it
      this.searchText(e, searchBoxQuery);
    })

	}

  searchText (e, searchBoxQuery) {
    // If there is a query, and enter is pressed
    if (e.keyCode === 13 && searchBoxQuery.length > 0){
      let toDisplay = [],
          queryRE = new RegExp("(" + searchBoxQuery + ")");

      for (let i = 0; i < this.messages.length; i++) {
        let queryResult = this.messages[i].text.search(queryRE);
      	if (queryResult !== -1) {
      		toDisplay.push(this.messages[i]);
      	};
      }

      // Display messages
      this.displaySomeMessages(toDisplay);
      this.blurSearchField();
    }
    return false;
  }

  // Flag days where those messages are sent
	displaySomeMessages (messages) {
    let selectedMsg =
        this.svg.selectAll('.selected-msg')
            .data(messages)

    // Remove previously selected messages
    selectedMsg
            .exit().remove()

    // Add new ones, if there are any
    if (messages.length > 0) {
      let width = this.getDayWidth();

      // X position
      let x = (d) => {
        let parsedDate = this.dayFormatParse(d.datetime);
        return this.timeScale(parsedDate) - width / 2;
      }

      // Add new messages
  		selectedMsg
  				.enter().append('rect')
  				.attr('class', 'selected-msg');

      selectedMsg
  				.attr('x', x)
  				.attr('y', 0)
  				.attr('width', width)
  				.attr('height', this.h);

      selectedMsg
          .style('fill', this.purple)
  				.style('opacity', .2);
    }
	}

  blurSearchField () {
    // Blur focus from input field
    let searchBox = document.getElementById("search-box");
    searchBox.blur()
  }

  getDayWidth () {
    let date0 = d3.timeParse(this.dayFormat)(this.messages[0].datetime),
        date1 = d3.timeDay.offset(date0, 1);

    return this.timeScale(date1) - this.timeScale(date0);
  }

  getMaxNumChars () {
    let allChars = this.chars.authorA.concat(this.chars.authorB);

    return d3.max(allChars, (d) => d.chars );
  }
}
