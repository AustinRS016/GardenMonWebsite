import { useEffect, useState } from 'react';
import AbstractGardenGraph from '../GardenGraphs/AbstractGardenGraph';
import './GardenCard.css';
import { MdOutlineMenuOpen, MdArrowBack } from 'react-icons/md';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { createNowDate } from '../App';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getGardenMonData } from '../dataFetching';

const minDate = '2024-03-01-00-00';

/**
 * @typedef {Object} GardenCardProps
 * @property {import('../dataFetching').GardenMonResponse} timeSeries
 * @property {import('../App').GraphParams} params
 * @property {import('../dataFetching').Device} device
 */

/**
 * @param {GardenCardProps} props
 * @returns {JSX.Element}
 */
const GardenCard = ({ timeSeries, params, device }) => {
	const [isHidden, setIsHidden] = useState(false);
	const [customDate, setCustomDate] = useState({
		startDate: null,
		endDate: null,
	});
	const [specificData, setSpecificData] = useState([]);

	const toggleHidden = () => {
		setIsHidden(!isHidden);
	};

	const handleMinDateChange = (date) => {
		const newDate = convertDateToString(date.toDate());
		setCustomDate({ ...customDate, startDate: newDate });
	};

	const handleMaxDateChange = (date) => {
		const newDate = convertDateToString(date.toDate());
		setCustomDate({ ...customDate, endDate: newDate });
	};

	const handleReplot = () => {
		const startDate = customDate.startDate ? customDate.startDate : minDate;
		const endDate = customDate.endDate ? customDate.endDate : createNowDate();
		const grouping = decideGrouping(startDate, endDate);
		console.log(grouping);
		getGardenMonData(startDate, endDate, grouping, device, [params.yKey]).then(
			(data) => {
				console.log(data);
				if (data.length > 0) {
					setSpecificData(data);
				}
			}
		);
	};

	const decideGrouping = (startDate, endDate) => {
		const diff = convertStringToDate(endDate) - convertStringToDate(startDate);

		const hourInMilliseconds = 3600000;
		const dayInMilliseconds = 86400000;
		const monthInMilliseconds = 2628000000;
		const yearInMilliseconds = 31540000000;

		if (diff < 3 * hourInMilliseconds) {
			return 'all_data';
		} else if (diff < 3 * dayInMilliseconds) {
			return 'fifteen_min';
		} else if (diff < 3 * monthInMilliseconds) {
			return 'hour';
		} else if (diff < yearInMilliseconds) {
			return 'day';
		} else {
			return 'month';
		}
	};

	return (
		<>
			<div className={`card-container`}>
				<div className={`${isHidden ? 'hidden' : null}`}>
					<MdOutlineMenuOpen className='menu-icon' onClick={toggleHidden} />
					<AbstractGardenGraph
						timeSeries={specificData.length ? specificData : timeSeries}
						params={params}
					/>
				</div>
				{isHidden && (
					<div className='graph-parameters-menu'>
						<MdArrowBack className='back-icon' onClick={toggleHidden} />
						<div className='parameters-container'>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<div className='parameter-row'>
									Start Date
									<DateTimePicker
										minDate={dayjs(convertStringToDate(minDate))}
										maxDate={dayjs(new Date())}
										value={dayjs(
											customDate.startDate
												? convertStringToDate(customDate.startDate)
												: convertStringToDate(minDate)
										)}
										onChange={handleMinDateChange}
									/>
								</div>
								<div className='parameter-row'>
									End Date
									<DateTimePicker
										minDate={dayjs(convertStringToDate(minDate))}
										maxDate={dayjs(new Date())}
										value={dayjs(
											customDate.endDate
												? convertStringToDate(customDate.endDate)
												: convertStringToDate(createNowDate())
										)}
										onChange={handleMaxDateChange}
									/>
								</div>
							</LocalizationProvider>
							{/* <div className='parameter-row'>Color Picker</div> */}
							<div className='button-tab active' onClick={handleReplot}>
								Replot
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default GardenCard;

const convertStringToDate = (str) => {
	const [year, month, day, hour, minute] = str.split('-');
	return new Date(year, month - 1, day, hour, minute);
};

const convertDateToString = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');

	return `${year}-${month}-${day}-${hour}-${minute}`;
};
