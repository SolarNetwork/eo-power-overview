import "../scss/style.scss";
import "billboard.js/dist/billboard.css";
import { loadHoursData, loadMonthsData } from "./sn.ts";
import { SeriesConfig, seriesConfig } from "./utils.ts";

// TODO: populate from document location query parameters
const urlParams = Object.fromEntries(new URLSearchParams(location.search));
const config: Required<SeriesConfig> = seriesConfig(urlParams);

if (config.backgroundColor != "#FFFFFF") {
	document
		.querySelector<HTMLBodyElement>("body")
		?.style.setProperty("background-color", config.backgroundColor);
}

loadHoursData(config)
	.then((datum) => {
		import("./charts.ts").then(({ renderHoursChart, updateHoursChart }) => {
			renderHoursChart(config, datum);
			setInterval(() => {
				loadHoursData(config).then((update) => {
					updateHoursChart(update);
				});
			}, 60_000);
		});
	})
	.catch((reason) => {
		console.error("Error generating hours chart: %s", reason);
	});

loadMonthsData(config)
	.then((datum) => {
		import("./charts.ts").then(
			({ renderMonthsChart, updateMonthsChart }) => {
				renderMonthsChart(config, datum);
				setInterval(() => {
					loadMonthsData(config).then((update) => {
						updateMonthsChart(update);
					});
				}, 600_000);
			}
		);
	})
	.catch((reason) => {
		console.error("Error generating months chart: %s", reason);
	});
