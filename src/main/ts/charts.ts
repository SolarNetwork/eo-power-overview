import bb, { Chart, ChartOptions, gauge } from "billboard.js";
import { GeneralDatum, SeriesConfig } from "./utils";

let chart: Chart;

function chartData(
	config: Required<SeriesConfig>,
	datum: Iterable<GeneralDatum>
): any[] {
	const data = [];
	for (const d of Array.from(datum)) {
		data.push([config.propName, Number(d[config.propName]) / config.scale]);
	}
	return data;
}

export function renderChart(
	config: Required<SeriesConfig>,
	datum: Iterable<GeneralDatum>
) {
	const options: ChartOptions = {
		data: {
			type: gauge(),
			columns: chartData(config, datum),
		},
		gauge: {
			fullCircle: true,
			startingAngle: 0,
			background: config.placeholderColor,
			min: config.minValue,
			max: config.maxValue,
			width: config.barWidth,
			label: {
				extents: function () {
					return "";
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
				name: () => config.displayName,
			},
		},
		bindto: "#chart",
	};
	if (config.cornerRadius > 0) {
		options.arc = {
			cornerRadius: {
				ratio: config.cornerRadius,
			},
		};
	}
	chart = bb.generate(options);
	if (config.textColor != "#000000") {
		document
			.querySelector<SVGTextElement>("#chart .bb-gauge-value")
			?.style.setProperty("fill", config.textColor);
	}
}

export function updateChart(
	config: Required<SeriesConfig>,
	datum: Iterable<GeneralDatum>
) {
	if (!chart) {
		return;
	}
	chart.load({
		columns: chartData(config, datum),
	});
}
