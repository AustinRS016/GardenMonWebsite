import './App.css';
import { getGardenMonData, getWeatherData } from './dataFetching';
import React, { useEffect, useState } from 'react';
import GardenCard from './UiComponents/GardenCard';

function App() {
	const [gardenData, setGardenData] = useState(
		/** @type {GardenMonResponse[] | []} */ ([])
	);
	const [device, setDevice] = useState(/** @type {Device} */ ('gardenmon'));

	const [timeGrouping, setTimeGrouping] = useState('All Time');

	const timeOptions = [
		'1 Hour',
		'6 Hours',
		'1 Day',
		'1 Week',
		'1 Month',
		'All Time',
	];

	const handleTimeChange = (e) => {
		setTimeGrouping(e.target.value);
	};
	useEffect(() => {
		const startDate = createStartDate(timeGrouping);
		const endDate = createNowDate();
		const grouping = decideGrouping(timeGrouping);
		getGardenMonData(startDate, endDate, grouping, device).then((data) =>
			setGardenData(data)
		);
	}, [device, timeGrouping]);

	return (
		<>
			<div className='App'>
				<div className='header'>
					<div className='button-container'>
						<button
							onClick={() => setDevice('gardenmon')}
							className={`button-tab ${
								device === 'gardenmon' ? 'active' : null
							}`}
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
						<div className='time-selection-container'>
							{timeOptions.map((option) => (
								<button
									key={option}
									onClick={handleTimeChange}
									className={`time-selection ${
										option === timeGrouping ? 'active' : null
									}`}
									value={option}
								>
									{option}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className='graphs-container'>
					{graphParameters.map((entry) => (
						<GardenCard
							timeGrouping={timeGrouping}
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

export const decideGrouping = (timeGrouping) => {
	switch (timeGrouping) {
		case '1 Hour':
			return 'all_data';
		case '6 Hours':
			return 'all_data';
		case '1 Day':
			return 'fifteen_min';
		case '1 Week':
			return 'hour';
		case '1 Month':
			return 'hour';
		case 'All Time':
			return 'hour';
		default:
			return 'hour';
	}
};

export const createStartDate = (timeGrouping) => {
	const now = new Date();

	switch (timeGrouping) {
		case '1 Hour':
			return dateToString(now.setHours(now.getHours() - 1));
		case '6 Hours':
			return dateToString(now.setHours(now.getHours() - 6));
		case '1 Day':
			return dateToString(now.setDate(now.getDate() - 1));
		case '1 Week':
			return dateToString(now.setDate(now.getDate() - 7));
		case '1 Month':
			return dateToString(now.setMonth(now.getMonth() - 1));
		case 'All Time':
			return `2024-03-01-00-00`;
		default:
			return `2024-03-01-00-00`;
	}
};

const dateToString = (dateSeconds) => {
	const date = new Date(dateSeconds);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${year}-${month}-${day}-${hour}-${minute}`;
};

export default App;

const xKey = 'insert_time';

/**
 * @typedef {('1 Hour' | '6 Hours' | '1 Day' | '1 Week' | '1 Month' | 'All Time')[]} TimeOptions
 */

/**
 * @typedef {Object} GraphParams
 * @property {string | Array} lineColor - Line color or array of line colors for gradient
 * @property {string} yLabel - Y-axis label
 * @property {string} xLabel - X-axis label
 * @property {string} title - Graph title
 * @property {string} yKey - Y-axis key
 */

/**
 * @type {GraphParams}
 */
const soilTempParams = {
	lineColor: ['purple', 'blue', 'green', 'yellow'],
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
