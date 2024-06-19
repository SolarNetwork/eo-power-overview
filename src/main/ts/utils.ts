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

	scale?: number;
	minValue?: number;
	maxValue?: number;

	barWidth?: number;
	width?: number;
	cornerRadius?: number;

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
		scale: config?.scale || 1000,
		minValue: config?.minValue || 0,
		maxValue: config?.maxValue || 10,
		barWidth: config?.barWidth || 50,
		width: config?.width || 300,
		cornerRadius: config?.cornerRadius || 0,
		color: config?.color || "#008000",
		backgroundColor: config?.backgroundColor || "#FFFFFF",
		placeholderColor: config?.placeholderColor || "#EDEDED",
		textColor: config?.textColor || "#000000",
	};
}
