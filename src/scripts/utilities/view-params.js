'use strict';

export function getViewParams () {
	let w = 760;

	if (document.querySelector(".widget")) {
		w = document.querySelector(".widget").offsetWidth - 44;
	}

	let	pink = "rgb(243, 38, 114)",
			purple = "rgb(71, 3, 166)",
			gold = "rgb(253, 199, 20)",
			redange = "rgb(254, 65, 71)",
			brown = "rgb(153, 61, 64)",
			green = "rgb(97, 210, 106)",
			dark_green = "rgb(38, 64, 00)";

	return {
		colorA: green,
		colorB: dark_green,
		w: w,
		h: 400,
		mg: 20,
		dayFormat: d3.timeFormat("%Y-%m-%d"),
		labelFormat: d3.timeFormat("%b %d '%y")
	}
}
