import './App.css';
import { getGardenMonData, getWeatherData } from './dataFetching';
import React, { useEffect, useState } from 'react';
import GardenCard from './UiComponents/GardenCard';

function App() {
	const [gardenData, setGardenData] = useState(
		/** @type {GardenMonResponse[] | []} */ ([])
	);
	const [device, setDevice] = useState(/** @type {Device} */ ('gardenmon'));

	useEffect(() => {
		const startDate = '2024-03-01-00-00';
		const endDate = createNowDate();
		const grouping = 'hour';
		getGardenMonData(startDate, endDate, grouping, device).then((data) =>
			setGardenData(data)
		);
	}, [device]);

	return (
		<>
			<div className='App'>
				<div className='header'>
					<button
						onClick={() => setDevice('gardenmon')}
						className={`button-tab ${device === 'gardenmon' ? 'active' : null}`}
					>
						Gardenmon
					</button>
					<button
						onClick={() => setDevice('gardenmon_two')}
						className={`button-tab ${
							device === 'gardenmon_two' ? 'active' : null
						}`}
					>
						Gardenmon2
					</button>
				</div>
				<div className='graphs-container'>
					{graphParameters.map((entry) => (
						<GardenCard
							key={entry.yKey}
							timeSeries={gardenData}
							params={entry}
							device={device}
						/>
					))}
				</div>
			</div>
		</>
	);
}

export const createNowDate = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const hour = now.getHours();
	const minute = now.getMinutes();
	return `${year}-${month}-${day}-${hour}-${minute}`;
};

export default App;

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
	yKey: 'soil_temp_f',
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
	yKey: 'soil_moisture_level',
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
	yKey: 'soil_moisture_val',
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
	yKey: 'ambient_humidity',
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
	yKey: 'ambient_light_lx',
	xKey: xKey,
};

/**
 * @type {GraphParams}
 */
const cpuTempParams = {
	lineColor: 'red',
	yLabel: 'Temperature (F)',
	xLabel: 'Time',
	title: 'CPU Temperature',
	yKey: 'cpu_temp_f',
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
	yKey: 'ambient_temp_f',
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

/**
 * @typedef {'gardenmon' | 'gardenmon_two'} Device
 */
