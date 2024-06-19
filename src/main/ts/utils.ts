/**
 * General SolarNetwork datum interface.
 */
export interface GeneralDatum extends Object {
	nodeId: number;
	sourceId: string;
	date: Date;
	[index: string]: any;
}

/**
 * Configuration for a chart series.
 */
export interface SeriesConfig {
	nodeId?: number;
	sourceId?: string;
	propName?: string;
	displayName?: string;
	accPropName?: string;
	accDisplayName?: string;

	numHours?: number;
	numMonths?: number;

	scale?: number;

	width?: number;

	color?: string;
	backgroundColor?: string;
	placeholderColor?: string;
	textColor?: string;
}

/**
 * Get a fully populated configuration.
 *
 * @param config the input configuration
 * @returns a fully populated configuration, using defaults if not otherwise provided
 */
export function seriesConfig(config?: SeriesConfig): Required<SeriesConfig> {
	return {
		nodeId: config?.nodeId || 690,
		sourceId: config?.sourceId || "EO/OC/ROOF1/SOLAR/1",
		propName: config?.propName || "watts",
		displayName: config?.displayName || "Power (kW)",
		accPropName: config?.accPropName || "wattHours",
		accDisplayName: config?.accDisplayName || "Energy (kWh)",
		numHours: config?.numHours || 24,
		numMonths: config?.numMonths || 13,
		scale: config?.scale || 1000,
		width: config?.width || 720,
		color: config?.color || "#008000",
		backgroundColor: config?.backgroundColor || "#FFFFFF",
		placeholderColor: config?.placeholderColor || "#EDEDED",
		textColor: config?.textColor || "#000000",
	};
}
