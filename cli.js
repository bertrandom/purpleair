#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 [sensor ID]')
    .option('c', {
        alias: 'class',
        type: 'boolean',
        desc: 'Append the AQI class at the end in parenthesis'
    })
    .option('j', {
        alias: 'json',
        type: 'boolean',
        desc: 'Output as JSON'
    })
    .demandCommand(1)
    .argv;

const libAqi = require('./lib/aqi');

var sensorId = argv._[0];

libAqi.getSensor(sensorId).then(async function (sensor) {
    var aqi = await libAqi.getAQI(sensor);

    var output = aqi;
    aqiClass = null;
    if (argv.class) {
        aqiClass = libAqi.getAQIClass(aqi);
        output = `${aqi} (${aqiClass})`;
    }

    if (argv.json) {
        var outputJson = {
            aqi: aqi,
            sensorId: sensorId,
        };
        if (aqiClass) {
            outputJson.class = aqiClass;
        }
        console.log(JSON.stringify(outputJson, null, 2));
    } else {
        console.log(output);
    }


}).catch(err => {
    console.error(err);
});
