# purpleair

Retrieve AQI (with [AQandU conversion](https://thebolditalic.com/understanding-purpleair-vs-airnow-gov-measurements-of-wood-smoke-pollution-562923a55226)) from a PurpleAir sensor via the CLI or as a library to your node script

Most of this code was stolen from [https://aqi.wtf](https://github.com/skalnik/aqi-wtf)

## determine your purpleair sensor ID

Open the PurpleAir map:
https://www.purpleair.com/map?mylocation

and click on the sensor closest to your location.

The URL bar will change to something like:

`https://www.purpleair.com/map?opt=1/mAQI/a10/cC0&select=62217#15.69/37.737125/-122.414218`

The sensor ID will be the value of the `select` parameter. In the above URL, the ID is 62217:

`https://www.purpleair.com/map?opt=1/mAQI/a10/cC0&select=`**`62217`**`#15.69/37.737125/-122.414218`


## cli usage

Install the module globally

```
npm install -g purpleair
```

Then call:

```
purpleair [sensor ID]
```

which will return the AQI.

Example output:

```
> purpleair 62217
139
```

With the AQI class:

```
> purpleair --class 62217
139 (unhealthy-for-sensitive-groups)
```

As JSON:
```
> purpleair --class --json 62217
{
  "aqi": 139,
  "sensorId": 62217,
  "class": "unhealthy-for-sensitive-groups"
}
```


## library usage

There are three functions:

* getSensor(sensorId)
* getAQI(sensor)
* getAQIClass(aqi)

Example:
```
const purpleair = require('purpleair');

const main = async () => {
    try {

        var sensor = await purpleair.getSensor(62217);
        var aqi = await purpleair.getAQI(sensor);

        console.log(aqi);

        var aqiClass = purpleair.getAQIClass(aqi);

        console.log(aqiClass);

    } catch (err) {
        console.error(err);
    }
};

main();
```

## License

MIT