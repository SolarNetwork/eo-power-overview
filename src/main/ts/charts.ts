import bb, { Chart, ChartOptions, areaSpline, bar, zoom } from "billboard.js";
import { timeFormat } from "d3-time-format";
import { GeneralDatum, SeriesConfig } from "./utils";

const hoursTooltipDateFormat = timeFormat("%Y-%m-%d %H:%M");
const monthsTooltipDateFormat = timeFormat("%Y-%m");

let hoursChart: Chart;
let monthsChart: Chart;

function setStyle(
	el: { style: CSSStyleDeclaration },
	prop: string,
	val: string
) {
	el.style.setProperty(prop, val);
}

function setupTextColor(containerId: string, config: Required<SeriesConfig>) {
	if (config.textColor != "#000000") {
		for (const t of document.querySelectorAll<SVGTextElement>(
			containerId + " text"
		)) {
			setStyle(t, "fill", config.textColor);
		}
		for (const l of document.querySelectorAll<SVGLineElement>(
			containerId + " .bb-axis line"
		)) {
			setStyle(l, "stroke", config.textColor);
		}
		for (const l of document.querySelectorAll<SVGLineElement>(
			containerId + " .bb-axis path"
		)) {
			setStyle(l, "stroke", config.textColor);
		}
	}
}

export function renderHoursChart(
	config: Required<SeriesConfig>,
	datum: Iterable<GeneralDatum>
) {
	const options: ChartOptions = {
		data: {
			type: areaSpline(),
			json: datum,
			keys: {
				x: "date",
				value: [config.propName],
			},
		},
		axis: {
			x: {
				type: "timeseries",
				localtime: false,
				tick: {
					fit: false,
					format: "%Y-%m-%d %H:%M",
				},
				padding: {
					left: 20,
					right: 10,
					unit: "px",
				},
			},
			y: {
				label: config.displayName,
				tick: {
					format: function (v: number) {
						return v / config.scale;
					},
				},
			},
		},
		color: {
			pattern: [config.color],
		},
		legend: {
			show: false,
		},
		size: {
			width: config.width,
		},
		zoom: {
			enabled: zoom(),
			type: "drag",
		},
		tooltip: {
			format: {
				title: hoursTooltipDateFormat,
				name: () => config.displayName,
			},
		},
		point: {
			focus: {
				only: true,
			},
		},
		bindto: "#hours-chart",
	};
	hoursChart = bb.generate(options);
	setupTextColor("#hours-chart", config);
}

export function updateHoursChart(datum: Iterable<GeneralDatum>) {
	if (!hoursChart) {
		return;
	}
	hoursChart.load({
		json: Array.from(datum),
	});
}

export function renderMonthsChart(
	config: Required<SeriesConfig>,
	datum: Iterable<GeneralDatum>
) {
	const options: ChartOptions = {
		data: {
			type: bar(),
			json: datum,
			keys: {
				x: "date",
				value: [config.accPropName],
			},
		},
		axis: {
			x: {
				type: "timeseries",
				localtime: false,
				tick: {
					format: "%Y-%m",
				},
				padding: {
					left: 20,
					right: 10,
					unit: "px",
				},
			},
			y: {
				label: config.accDisplayName,
				tick: {
					format: function (v: number) {
						return v / config.scale;
					},
				},
			},
		},
		color: {
			pattern: [config.color],
		},
		legend: {
			show: false,
		},
		size: {
			width: config.width,
		},
		tooltip: {
			format: {
				title: monthsTooltipDateFormat,
				name: () => config.accDisplayName,
			},
		},
		point: {
			focus: {
				only: true,
			},
		},
		bindto: "#months-chart",
	};
	monthsChart = bb.generate(options);
	setupTextColor("#months-chart", config);
}

export function updateMonthsChart(datum: Iterable<GeneralDatum>) {
	if (!monthsChart) {
		return;
	}
	monthsChart.load({
		json: Array.from(datum),
	});
}
