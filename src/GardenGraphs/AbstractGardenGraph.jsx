import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './AbstractGardenGraph.css';

/**
 * Abstract garden graph component
 * @param {Object} props - Component props
 * @param {import('../dataFetching').GardenMonResponse[]} props.timeSeries - GardenMon data
 * @param {import('../App').GraphParams} props.params - Parameters for the graph
 * @param {import('../App').TimeOptions} timeGrouping - Time grouping
 */
const GardenGraph = ({ timeSeries, params, timeGrouping }) => {
	const { yKey, xKey, lineColor, yLabel, xLabel, title } = params;

	const [statistics, setStatistics] = useState();

	const isGradient = Array.isArray(lineColor);

	useEffect(() => {
		let result = timeSeries.reduce(
			(acc, element) => {
				acc.sum += +element[yKey];
				acc.min = acc.min < element[yKey] ? acc.min : element[yKey];
				acc.max = acc.max > element[yKey] ? acc.max : element[yKey];
				acc.minDate = acc.minDate < element[xKey] ? acc.minDate : element[xKey];
				acc.maxDate = acc.maxDate > element[xKey] ? acc.maxDate : element[xKey];
				return acc;
			},
			{
				sum: 0,
				min: Infinity,
				max: -Infinity,
				minDate: Infinity,
				maxDate: -Infinity,
			}
		);

		setStatistics(result);

		// Check if data is available
		if (!timeSeries) return;

		// Set margins and dimensions
		const margin = { top: 5, right: 30, bottom: 25, left: 30 },
			width = 420 - margin.left - margin.right,
			height = 300 - margin.bottom - margin.top;

		// Remove existing graph in case of redrawing
		d3.select(`#${yKey}-graph`)?.selectAll('*')?.remove();

		// Create SVG element
		const svg = d3
			.select(`#${yKey}-graph`)
			// this makes the graph responsive
			.attr('viewBox', `0 0 420 300`)
			.attr('width', '100%')
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Create x scale
		const x = d3
			.scaleTime()
			.domain(
				d3.extent(timeSeries, (d) => {
					const newDate = new Date(formatDate(d[xKey]));
					return newDate;
				})
			)
			.range([0, width]);

		// Get min and max y values
		const yMin = d3.min(timeSeries, (d) => Number(d[yKey]));
		const yMax = d3.max(timeSeries, (d) => Number(d[yKey]));

		// Create y scale
		const y = d3
			.scaleLinear()
			.domain([yMin * 0.9, yMax * 1.1])
			.range([height, 0]);

		// Create line
		const line = d3
			.line()
			.x((d) => x(new Date(formatDate(d[xKey]))))
			.y((d) => y(d[yKey]));

		// Add background to graph before adding line
		svg
			.append('rect')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', '#f0f0f0'); // Light gray background

		// Add gradient to graph
		{
			isGradient && addGradient(svg, lineColor);
		}

		// Add line to graph
		svg
			.append('path')
			.datum(timeSeries)
			.attr('fill', 'none')
			.attr('stroke', `${isGradient ? 'url(#gradient)' : lineColor}`)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);

		// Add x axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(handleXAxis(x, timeGrouping));

		// Add y axis
		svg.append('g').call(
			d3
				.axisLeft(y)
				.ticks(5)
				.tickFormat(function (d) {
					return d >= 1000 ? d / 1000 + 'k' : d;
				})
				.tickSizeOuter(0)
		);
	}, [timeSeries, yKey, params]);

	return (
		<div>
			<div style={{ textAlign: 'center' }}>{title}</div>
			<svg id={`${yKey}-graph`} />
			{statistics && (
				<div className='statistics'>
					<div>Min: {Number(statistics.min).toFixed(2)}</div>
					<div>
						Avg: {Number(statistics.sum / timeSeries.length).toFixed(2)}
					</div>
					<div>Max: {Number(statistics.max).toFixed(2)}</div>
				</div>
			)}
		</div>
	);
};

export default GardenGraph;

const formatDate = (unixTimestamp) => {
	let date = new Date(unixTimestamp * 1000); // Convert to milliseconds
	return date;
};

const addGradient = (svg, lineColor) => {
	svg
		.append('defs')
		.append('linearGradient')
		.attr('id', 'gradient')
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '0%')
		.attr('y2', '100%')
		.selectAll('stop')
		.data(
			lineColor.map((color, i) => ({
				offset: `${(i * 100) / (lineColor.length - 1)}%`,
				color,
			}))
		)
		.enter()
		.append('stop')
		.attr('offset', function (d) {
			return d.offset;
		})
		.attr('stop-color', function (d) {
			return d.color;
		});
};

/**
 * Handle x axis based on time grouping
 * @param {d3.ScaleTime<number, number>} x - x scale
 * @param {import('../App').TimeOptions} timeGrouping - Time grouping
 * @returns {d3.Axis<d3.AxisDomain>} - x axis
 */
const handleXAxis = (x, timeGrouping) => {
	let format;
	let ticks;

	switch (timeGrouping) {
		case '1 Hour':
			format = '%I:%M %p';
			ticks = d3.timeMinute.every(10);
			break;
		case '6 Hours':
			format = '%I %p';
			ticks = d3.timeHour.every(1);
			break;
		case '1 Day':
			format = '%I %p';
			ticks = d3.timeHour.every(3);
			break;
		case '1 Week':
			format = '%b %d';
			ticks = d3.timeDay.every(1);
			break;
		case '1 Month':
			format = '%b %d';
			ticks = d3.timeDay.every(3);
			break;
		case 'All Time':
		default:
			format = '%b %d';
			ticks = d3.timeDay.every(5);
			break;
	}

	return d3
		.axisBottom(x)
		.ticks(ticks)
		.tickFormat(d3.timeFormat(format))
		.tickSizeOuter(0);
};
