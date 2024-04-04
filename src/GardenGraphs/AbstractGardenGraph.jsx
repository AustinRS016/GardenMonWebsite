import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './AbstractGardenGraph.css';

/**
 * Abstract garden graph component
 * @param {Object} props - Component props
 * @param {GardenMonResponse[]} props.timeSeries - GardenMon data
 * @param {import('../App').GraphParams} props.params - Parameters for the graph
 */
const GardenGraph = ({ timeSeries, params }) => {
	console.log(timeSeries);
	const { yKey, xKey, lineColor, yLabel, xLabel, title } = params;

	const [statistics, setStatistics] = useState();

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
			width = 440 - margin.left - margin.right,
			height = 300 - margin.bottom - margin.top;

		// Remove existing graph in case of redrawing
		d3.select(`#${yKey}-graph`)?.selectAll('*')?.remove();

		// Create SVG element
		const svg = d3
			.select(`#${yKey}-graph`)
			// this makes the graph responsive
			.attr('viewBox', `0 0 400 300`)
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

		// Add line to graph
		svg
			.append('path')
			.datum(timeSeries)
			.attr('fill', 'none')
			.attr('stroke', lineColor)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);

		// Add x axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)

			.call(
				d3
					.axisBottom(x)
					.ticks(7)
					.tickFormat(d3.timeFormat('%b %d'))
					.tickSizeOuter(0)
			);

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

const formatDate = (date) => date.replace(' ', 'T') + ':00:00';
