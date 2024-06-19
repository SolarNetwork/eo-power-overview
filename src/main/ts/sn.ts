import { timeMonth } from "d3-time";
import {
	Aggregations,
	DatumFilter,
	DatumReadingTypes,
} from "solarnetwork-api-core/lib/domain";
import {
	Environment,
	HttpContentType,
	SolarQueryApi,
	SolarQueryPublicPathKey,
} from "solarnetwork-api-core/lib/net";
import { DatumStreamMetadataRegistry } from "solarnetwork-api-core/lib/util";
import { datumForStreamData } from "solarnetwork-api-core/lib/util/datum";

import { GeneralDatum, SeriesConfig } from "./utils";

const urlHelper = new SolarQueryApi(
	new Environment({
		[SolarQueryPublicPathKey]: true,
		proxyUrlPrefix: "https://query.solarnetwork.net",
	})
);

const ACCEPT_JSON = {
	headers: {
		Accept: HttpContentType.APPLICATION_JSON,
	},
};

function parseResults(json: any): Promise<Iterable<GeneralDatum>> {
	const result: GeneralDatum[] = [];
	const reg = DatumStreamMetadataRegistry.fromJsonObject(json.meta);
	if (!reg) {
		return Promise.reject("JSON could not be parsed.");
	}
	for (const data of json.data) {
		const meta = reg.metadataAt(data[0]);
		if (!meta) {
			continue;
		}
		const d = datumForStreamData(data, meta)?.toObject();
		if (d) {
			result.push(d as GeneralDatum);
		}
	}
	return Promise.resolve(result);
}

export async function loadHoursData(
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
	//filter.aggregation = Aggregations.FiveMinute;

	const end = new Date();
	end.setHours(0, 0, 0, 0);
	filter.endDate = new Date(end.getTime() + 86_400_000); // end of next hour (ex)
	filter.startDate = new Date(end.getTime() - 3_600_000 * config.numHours);

	const url = urlHelper.toRequestUrl(urlHelper.streamDatumUrl(filter));
	const res = await fetch(url, ACCEPT_JSON);
	const json = await res.json();
	if (
		!(
			json &&
			Array.isArray(json.data) &&
			Array.isArray(json.meta) &&
			json.meta.length
		)
	) {
		return Promise.reject("No data available.");
	}

	return parseResults(json);
}

export async function loadMonthsData(
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
	filter.aggregation = Aggregations.Month;

	const end = timeMonth.ceil(new Date());
	filter.localEndDate = end;
	filter.localStartDate = timeMonth.offset(end, -config.numMonths);

	const url = urlHelper.toRequestUrl(
		urlHelper.streamReadingUrl(DatumReadingTypes.Difference, filter)
	);
	const res = await fetch(url, ACCEPT_JSON);
	const json = await res.json();
	if (
		!(
			json &&
			Array.isArray(json.data) &&
			Array.isArray(json.meta) &&
			json.meta.length
		)
	) {
		return Promise.reject("No data available.");
	}

	return parseResults(json);
}
