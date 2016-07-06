'use strict';

export function getViewParams () {
	let w = 760;

	if (document.querySelector(".widget")) {
		w = document.querySelector(".widget").offsetWidth - 44;
	}

	return {
		pink: "rgb(243, 38, 114)",
		purple: "rgb(71, 3, 166)",
		gold: "rgb(253, 199, 20)",
		w: w,
		h: 400,
		mg: 20,
		dayFormat: d3.timeFormat("%Y-%m-%d"),
		labelFormat: d3.timeFormat("%b %d '%y")
	}
}
