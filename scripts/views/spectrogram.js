module.exports = {
  render: function (args) {
    this.args = args;
    var w = args.options.w,
        h = args.options.h,
        pink = args.options.pink,
        purple = args.options.purple,
        dayFormat = args.options.dayFormat,
        labelFormat = args.options.labelFormat,
        Convo = args.Convo;

    var chars = Convo.getCharactersByAuthorAndDay();

    d3.select('#graph-viewer svg').remove();

    var svg = d3.select('#graph-viewer')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

    var timeScale = d3.time.scale()
                      .domain([Convo.date0, Convo.dateF])
                      .range([0, w]);

    var allChars = chars.authorA.concat(chars.authorB);
    var maxChar = d3.max(allChars, function (d) {
      return d.chars;
    });

    var charScale = d3.scale.linear()
                      .domain([0, maxChar])
                      .range([h/2, 0]);

    var lineFunction = d3.svg.area()
      .x(function (d) { return timeScale(dayFormat.parse(d.datetime)); })
      .y0(function (d) { return charScale(d.chars); })
      .y1(function (d) { return charScale(0); })
      .interpolate("basis");

    var lineFunction2 = d3.svg.area()
      .x(function (d) { return timeScale(dayFormat.parse(d.datetime)); })
      .y0(function (d) { return charScale(-d.chars); })
      .y1(function (d) { return charScale(0); })
      .interpolate("basis");

    var lineA = svg.append("path")
      .attr("d", lineFunction(chars.authorA))
      .attr("fill", pink);

    var lineB = svg.append("path")
      .attr("d", lineFunction2(chars.authorB))
      .attr("fill", purple);

    svg.append("text")
      .attr("class", "time-label")
      .attr("x", 0)
      .attr("y", h/4)
      .text(labelFormat(Convo.date0));

    svg.append("text")
      .attr("class", "time-label")
      .attr("x", timeScale(Convo.dateF))
      .attr("y", h/4)
      .style("text-anchor", "end")
      .text(labelFormat(Convo.dateF));

    // To highlight messages later on
    this.svg = svg;
    this.timeScale = timeScale;
    this.charScale = charScale;
  },

  // Flag days where those messages are sent
	displaySomeMessages: function (messages) {
		var svg = this.svg,
				timeScale = this.timeScale,
				charScale = this.charScale,
        dayFormat = this.args.options.dayFormat,
        purple = this.args.options.purple,
        h = this.args.options.h,
        date0 = dayFormat.parse(messages[0].datetime),
        date1 = d3.time.day.offset(date0, 1),
        w = timeScale(date1) - timeScale(date0);

		if (svg) {
			svg.selectAll('.selected-msg').remove();
			svg.selectAll('.selected-msg')
				.data(messages)
				.enter().append('rect')
				.attr('class', 'selected-msg')
				.attr('x', function (d) {
					return timeScale(dayFormat.parse(d.datetime)) - w / 2; })
				.attr('y', 0)
				.attr('width', w)
				.attr('height', h)
				.style('fill', purple)
				.style('opacity', .2);
		}
	},

  /*
	Events on the dashboard
	*/

	addEvents: function (messages) {
		var searchForm = document.getElementById("search-form");
		searchForm.addEventListener('submit', function (e) {
			e.preventDefault();
		});

		var searchBox = document.getElementById("search-box");
		searchBox.addEventListener('keypress',
      this.searchText.bind(this, searchBox, messages));
	},

  searchText: function (searchBox, messages, e) {
    if(e.keyCode === 13 && searchBox.value.length > 0){
      var toDisplay = [];
      var valueRE = new RegExp("(" + searchBox.value + ")");

      for (var i = 0; i < messages.length; i++) {
      	if (messages[i].text.search(valueRE) !== -1) {
      		toDisplay.push(messages[i]);
      	};
      }

      //if (toDisplay.length > 0) {
      	this.displaySomeMessages(toDisplay);
      //}
      document.getElementById("search-box").blur()
    }
    return false;
  }
}
