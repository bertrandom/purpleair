#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 [sensor ID]')
    .option('c', {
        alias: 'class',
        type: 'boolean',
        desc: 'Append the AQI class at the end in parenthesis'
    })
    .demandCommand(1)
    .argv;

const libAqi = require('./lib/aqi');

libAqi.getSensor(argv._[0]).then(async function (sensor) {
    var aqi = await libAqi.getAQI(sensor);

    var output = aqi;
    if (argv.class) {
        var aqiClass = libAqi.getAQIClass(aqi);
        output = `${aqi} (${aqiClass})`;
    }

    console.log(output);

}).catch(err => {
    console.error(err);
});
