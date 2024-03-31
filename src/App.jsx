import './App.css';
import { getGardenMonData, getWeatherData } from './dataFetching';
import { LightBar } from './Lightbar';
import React, { useEffect, useState } from 'react';
import timeSeries from './testData.json';
import AbstractGardenGraph from './GardenGraphs/AbstractGardenGraph';

const xKey = 'insert_time';

/**
 * @typedef {Object} GraphParams
 * @property {string} lineColor - Line color
 * @property {string} yLabel - Y-axis label
 * @property {string} xLabel - X-axis label
 * @property {string} title - Graph title
 * @property {string} yKey - Y-axis key
 */

/**
 * @type {GraphParams}
 */
const soilTempParams = {
	lineColor: 'green',
	yLabel: 'Temperature (F)',
	xLabel: 'Time',
	title: 'Soil Temperature',
	yKey: 'avg_soil_temp_f',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const soilMoistureLevelParams = {
	lineColor: 'brown',
	yLabel: 'Moisture Level',
	xLabel: 'Time',
	title: 'Soil Moisture',
	yKey: 'avg_soil_moisture_level',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const soilMoistureValParams = {
	lineColor: 'orange',
	yLabel: 'Moisture Value',
	xLabel: 'Time',
	title: 'Soil Moisture Value',
	yKey: 'avg_soil_moisture_val',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const humidityParams = {
	lineColor: 'blue',
	yLabel: 'Humidity (%)',
	xLabel: 'Time',
	title: 'Humidity',
	yKey: 'avg_ambient_humidity',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const lightParams = {
	lineColor: 'teal',
	yLabel: 'Light (lux)',
	xLabel: 'Time',
	title: 'Light',
	yKey: 'avg_ambient_light_lx',
	xKey: xKey,
};

const test = 0;

/**
 * @type {GraphParams}
 */
const cpuTempParams = {
	lineColor: 'red',
	yLabel: 'Temperature (F)',
	xLabel: 'Time',
	title: 'CPU Temperature',
	yKey: 'avg_cpu_temp_f',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const ambientTempParams = {
	lineColor: 'purple',
	yLabel: 'Temperature (F)',
	xLabel: 'Time',
	title: 'Ambient Temperature',
	yKey: 'avg_ambient_temp_f',
	xKey: xKey,
};
/**
 * @type {GraphParams[]}
 */
const graphParameters = [
	cpuTempParams,
	soilTempParams,
	soilMoistureLevelParams,
	soilMoistureValParams,
	humidityParams,
	lightParams,
	ambientTempParams,
];

function App() {
	// const [weatherData, setWeatherData] = useState(undefined);
	// useEffect(() => {
	// 	const startDate = '2024-03-25-00';
	// 	const endDate = '2024-03-26-00';
	// 	const grouping = 'hour';
	// 	getGardenMonData(startDate, endDate, grouping).then((res) =>
	// 		setWeatherData(res.data)
	// 	);
	// }, []);
	return (
		<div className='App'>
			{graphParameters.map((entry) => (
				<div className='card-container'>
					<AbstractGardenGraph
						key={entry.yKey}
						timeSeries={timeSeries}
						params={entry}
					/>
				</div>
			))}
		</div>
	);
}

export default App;
