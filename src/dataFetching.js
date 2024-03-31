import axios from "axios"

const apiKey = process.env.REACT_APP_API_WEATHER

export const getWeatherData = async () => {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=47.651927&lon=-122.370340&appid=${apiKey}`)
    return res
}

/**
 * Gets data from gardenMon API
 * @param {string} startDate Beginning of the date range, as "YYYY-MM-DD-HH-mm"
 * @param {string} endDate End of the date range, as "YYYY-MM-DD-HH-mm"
 * @param {TimeGroup} grouping Period of time to group data by
 * @returns {Promise<{data: GardenMonResponse[]}>}
 */
export const getGardenMonData = async (startDate, endDate, grouping, device) => {
    try {
        const res = await axios.get(`http://192.168.10.79:5000/data?start_date=${startDate}&end_date=${endDate}&grouping_period=${grouping}&device=${device}`)
        return res?.data ?? []
    } catch (error) {
        return { data: [] }
    }
}

/**
 * @typedef {'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'} TimeGroup
 */

const example = {
    "avg_ambient_humidity": 77.9300001780192,
    "avg_ambient_light_lx": 0.0,
    "avg_ambient_temp_f": 49.07150020599365,
    "avg_cpu_temp_f": 86.9211669921875,
    "avg_soil_moisture_level": "10.0000",
    "avg_soil_moisture_val": "1538.0333",
    "avg_soil_temp_f": 53.95249996185303,
    "device": "gardenmon",
    "insert_time": "2024-03-25 00"
}

/**
 * @typedef {Object} GardenMonResponse
 * @property {number} avg_ambient_humidity - humidity
 * @property {number} avg_ambient_light_lx - light in lux
 * @property {number} avg_ambient_temp_f - temperature in Fahrenheit
 * @property {number} avg_cpu_temp_f - temperature in Fahrenheit
 * @property {string} avg_soil_moisture_level - soil moisture level
 * @property {string} avg_soil_moisture_val -  soil moisture value
 * @property {number} avg_soil_temp_f -  soil temperature in Fahrenheit
 * @property {string} device - Device name
 * @property {string} insert_time - Insertion time
 */