import { DatumFilter } from "solarnetwork-api-core/lib/domain";
import {
	Environment,
	SolarQueryApi,
	SolarQueryPublicPathKey,
} from "solarnetwork-api-core/lib/net";

import { GeneralDatum, SeriesConfig } from "./utils";

const urlHelper = new SolarQueryApi(
	new Environment({
		[SolarQueryPublicPathKey]: true,
		proxyUrlPrefix: "https://query.solarnetwork.net/1m",
	})
);

export async function loadData(
	config: Required<SeriesConfig>
): Promise<Iterable<GeneralDatum>> {
	const nodeId = config.nodeId;
	const sourceId = config.sourceId;

	if (!(nodeId && sourceId)) {
		return Promise.reject("Incomplete settings.");
	}

	const filter = new DatumFilter();
	filter.nodeId = Number(nodeId);
	filter.sourceId = sourceId;

	// set the start date to 48h from today to help make the query faster
	const date = new Date(Date.now() - 172_800_000);
	date.setUTCHours(0, 0, 0, 0);
	filter.startDate = date;

	const url = urlHelper.toRequestUrl(urlHelper.mostRecentDatumUrl(filter));
	const res = await fetch(url);
	const json = await res.json();
	if (
		!(
			json &&
			Array.isArray(json.data?.results) &&
			json.data?.results?.length
		)
	) {
		return Promise.reject("No data available.");
	}

	return Promise.resolve(json.data.results);
}
