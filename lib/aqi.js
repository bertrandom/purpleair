const axios = require('axios');

// Most of this logic is taken from https://github.com/skalnik/aqi-wtf

function bustedSensor(sensor) {

    const pValues = [
        "p_0_3_um",
        "p_0_5_um",
        "p_1_0_um",
        "p_2_5_um",
        "p_5_0_um",
        "p_10_0_um",
        "pm1_0_cf_1",
        "pm2_5_cf_1",
        "pm10_0_cf_1",
        "pm1_0_atm",
        "pm2_5_atm",
        "pm10_0_atm",
    ];

    for (const pValue of pValues) {
        if (sensor[pValue] !== "0.0") {
            return false;
        }
    }

    return true;

}

function aqanduAQIFromPM(pm) {
    return aqiFromPM(0.778 * pm + 2.65);
}

function aqiFromPM(pm) {
    if (isNaN(pm)) return "-";
    if (pm == undefined) return "-";
    if (pm < 0) return pm;
    if (pm > 1000) return "-";

    if (pm > 350.5) {
        return calcAQI(pm, 500, 401, 500, 350.5);
    } else if (pm > 250.5) {
        return calcAQI(pm, 400, 301, 350.4, 250.5);
    } else if (pm > 150.5) {
        return calcAQI(pm, 300, 201, 250.4, 150.5);
    } else if (pm > 55.5) {
        return calcAQI(pm, 200, 151, 150.4, 55.5);
    } else if (pm > 35.5) {
        return calcAQI(pm, 150, 101, 55.4, 35.5);
    } else if (pm > 12.1) {
        return calcAQI(pm, 100, 51, 35.4, 12.1);
    } else if (pm >= 0) {
        return calcAQI(pm, 50, 0, 12, 0);
    } else {
        return undefined;
    }
}

function calcAQI(Cp, Ih, Il, BPh, BPl) {
    // The AQI equation https://forum.airnowtech.org/t/the-aqi-equation/169
    var a = Ih - Il;
    var b = BPh - BPl;
    var c = Cp - BPl;
    return Math.round((a / b) * c + Il);
}

function getAQIClass(aqi) {
    if (aqi >= 401) {
        return "very-hazardous";
    } else if (aqi >= 301) {
        return "hazardous";
    } else if (aqi >= 201) {
        return "very-unhealthy";
    } else if (aqi >= 151) {
        return "unhealthy";
    } else if (aqi >= 101) {
        return "unhealthy-for-sensitive-groups";
    } else if (aqi >= 51) {
        return "moderate";
    } else if (aqi >= 0) {
        return "good";
    } else {
        return undefined;
    }
}

async function getSensor(sensorId) {
    var response = await axios.get('https://www.purpleair.com/json?show=' + sensorId);
    return response.data;
}

async function getAQI(sensor) {
    let pm25s = [];

    for (const subsensor of sensor.results) {
        if (!bustedSensor(subsensor)) {
            pm25s.push(parseFloat(subsensor["PM2_5Value"]));
        }
    }
    const pm25 = pm25s.reduce((a, b) => a + b) / pm25s.length;
    return aqanduAQIFromPM(pm25);
}

module.exports = {
    getSensor: getSensor,
    getAQI: getAQI,
    getAQIClass: getAQIClass,
}