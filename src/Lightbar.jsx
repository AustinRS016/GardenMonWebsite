import * as d3 from 'd3';

export const LightBar = ({ weatherData }) => {
	const testData = createTestData(92, 30000);
	const { sunrise, sunset } = weatherData.sys;

	const sunHelper = new SunriseHelper(sunrise, sunset);

	return (
		<span className='light-bar'>
			<span
				className='current-time-indicator'
				style={{ left: `${sunHelper.getCurrentTimePercent()}%` }}
			/>
			<span
				className='sun-bar sunrise'
				style={{ left: `${sunHelper.getSunsetAsPercentage()}%` }}
			/>
			<span
				className='sun-bar-text-container'
				style={{ left: `${sunHelper.getSunsetAsPercentage()}%` }}
			>
				<spann className='sun-bar-text'>{sunHelper.getSunsetAsTime()}</spann>
			</span>
			<span
				className='sun-bar sunset'
				style={{ left: `${sunHelper.getSunriseAsPercentage()}%` }}
			/>
			<span
				className='sun-bar-text-container'
				style={{ left: `${sunHelper.getSunriseAsPercentage()}%` }}
			>
				<span className='sun-bar-text'>{sunHelper.getSunriseAsTime()}</span>
			</span>
			<span className='color-chunk-container'>
				{testData.map((v, i) => {
					return <FifteenMinuteChunk value={v} key={i} />;
				})}
			</span>
		</span>
	);
};

export const FifteenMinuteChunk = ({ value }) => {
	const color = d3.interpolateInferno(value);
	return <span className='color-chunk' style={{ backgroundColor: color }} />;
};

const createTestData = (length, maxValue) => {
	const randomData = Array.from({ length: 192 }, () =>
		Math.floor(Math.random() * maxValue)
	);
	const firstHalf = randomData.slice(0, Math.floor(length / 2));
	const secondHalf = randomData.slice(Math.floor(length / 2), length - 1);
	const output = [
		...firstHalf.sort((a, b) => a - b),
		...secondHalf.sort((a, b) => b - a),
	];
	return output.map((v) => v / maxValue);
};

/**
 * @param {number} sunset Time representing in UTC seconds
 * @param {number} sunrise ""
 */
const SunriseHelper = class {
	constructor(sunrise, sunset) {
		this.sunset = new Date(sunset * 1000);
		this.sunrise = new Date(sunrise * 1000);
		this.timeOptions = {
			hour: 'numeric',
			minute: 'numeric',
		};
	}

	/**
	 * Give the time of day for given time as a percentage (noon = 50%)
	 * @param {Object} time Javascript Date
	 * @returns {number} 2 digit integer representing a percentage
	 */
	convertTimePercentOfDay = (time) => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const totalMinutes = hours * 60 + minutes;
		const percent = (totalMinutes / 1440).toFixed(2) * 100;
		return percent;
	};

	getCurrentTimePercent() {
		return this.convertTimePercentOfDay(new Date());
	}

	getSunsetAsTime() {
		return this.sunset.toLocaleTimeString([], this.timeOptions);
	}

	getSunsetAsPercentage() {
		return this.convertTimePercentOfDay(this.sunset);
	}

	getSunriseAsTime() {
		return this.sunrise.toLocaleTimeString([], this.timeOptions);
	}

	getSunriseAsPercentage() {
		return this.convertTimePercentOfDay(this.sunrise);
	}
};
