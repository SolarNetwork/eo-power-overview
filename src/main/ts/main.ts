import "../scss/style.scss";
import "billboard.js/dist/billboard.css";
import { loadData as snLoadData } from "./sn.ts";
import { SeriesConfig, seriesConfig } from "./utils.ts";

// TODO: populate from document location query parameters
const urlParams = Object.fromEntries(new URLSearchParams(location.search));
const config: Required<SeriesConfig> = seriesConfig(urlParams);

snLoadData(config)
	.then((datum) => {
		import("./charts.ts").then(({ renderChart, updateChart }) => {
			renderChart(config, datum);
			setInterval(() => {
				snLoadData(config).then((update) => {
					updateChart(config, update);
				});
			}, 60_000);
		});
	})
	.catch((reason) => {
		console.error("Error generating chart: %s", reason);
	});
