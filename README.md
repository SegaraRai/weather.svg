# Weather.svg

Weather.svg is a server-based widget that generates animated weather widget images in SVG format.
It provides weather information in a visually appealing way.

**Leeds, UK** (displayed in your preferred language and units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=53.86681894798549&amp;longitude=-1.6584345829082057" alt="Weather in Leeds" style="width:100%" />

**Greenwich, US** (displayed in English, regular time, Fahrenheit, and imperial units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=41.021247610322455&amp;longitude=-73.62548875414416&amp;lang=en-US&amp;time_format=12h&amp;air_pressure=hpa&amp;precipitation=inch&amp;temperature=fahrenheit&amp;wind_speed=mph" alt="Weather in Connecticut" style="width:100%" />

**Tsukuba, Japan** (displayed in Japanese, military time, Celsius, and metric units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=36.08297932646632&amp;longitude=140.11147093989302&amp;lang=ja-JP&amp;time_format=24hn&amp;air_pressure=hpa&amp;precipitation=mm&amp;temperature=celsius&amp;wind_speed=mps" alt="Weather in Tsukuba" style="width:100%" />

## Usage

Add the following query parameters to the URL of the API server: `https://weather-svg.abelia.workers.dev/weather.svg`.

### Location Parameters

- `latitude`: Required. Must be a value between -90 and 90.
- `longitude`: Required. Must be a value between -180 and 180.
- `location`: Optional. Specify a custom name for the location. If provided, reverse geocoding will not be used.
- `location_lang`: Optional. Specify the language for the `location` parameter (e.g., `en-US`). Required if `location` is specified.

Alternatively, you can use `encrypted_location` instead of the above parameters.
To obtain `encrypted_location`, add `&encrypt` to the end of the plain location URL.

### Preference Parameters

All of these parameters are optional.

- `lang`: Default is `auto`, can be set to a BCP 47 tag, e.g., `en-US`.  
  Specifies the language of the weather information, the datetime format, and the location name if `location` is not provided.  
  Automatically detected from the `Accept-Language` header if `auto` is specified.
- `time_format`: Default is `auto`, can be set to `12h`, `24h`, `24hn`, or `native`.  
  `24hn` represents 24-hour notation without a leading zero.  
  `native` represents the native datetime format (including year) of the language.
- `temperature`: Default is `auto`, can be set to `celsius` or `fahrenheit`.
- `precipitation`: Default is `auto`, can be set to `mm` or `inch`.
- `wind_speed`: Default is `auto`, can be set to `mps`, `kmph`, `mph`, or `knot`.  
  Note that `mph` stands for _miles_ per hour, while `mps` stands for _meters_ per second.
- `air_pressure`: Default is `auto`, can be set to `hpa` or `inhg`.

### Examples

- `https://weather-svg.abelia.workers.dev/weather.svg?latitude=36.08297932646632&longitude=140.11147093989302`
- `https://weather-svg.abelia.workers.dev/weather.svg?latitude=41.945053494801634&longitude=-72.64589591337739&lang=en-US&time_format=12h&precipitation=inch&temperature=fahrenheit&wind_speed=mph`

## Development

To start development, make sure you have Node.js and pnpm installed.
The required versions are specified in `package.json`.
We recommend using [proto](https://moonrepo.dev/proto) to install the necessary tools.

Follow these steps:

1. Clone this repository.
2. Run `pnpm install` to install the dependencies.
3. Start the development Vite server by running `pnpm dev`.
4. Create a `.dev.vars` file based on `.dev.vars.example` and fill in the values.
5. Preview the API server with `pnpm preview`.

### Deployment

To deploy the API server, follow these steps:

1. Edit `wrangler.toml` to match your Cloudflare account and Workers KV namespace ID.
2. Set the required secrets by running `pnpm wrangler secret put`.  
   Refer to `src/server/bindings.ts` for the necessary secrets.
3. Deploy your API server with `pnpm wrangler deploy`.

For automatic deployment using GitHub Actions, make sure to add `CLOUDFLARE_API_TOKEN` to your actions secrets.  
For more information, see [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

## Contribution

Please feel free to open an issue for any bug or feature request.
Pull requests are also welcome.

## License

This project is licensed under the MIT License.

## Credits

- Weather data by [Open-Meteo](https://open-meteo.com/), CC BY 4.0.
- Locality data by [BigDataCloud](https://www.bigdatacloud.com/).
- Icons from [Meteocons by Bas Milius](https://bas.dev/work/meteocons), MIT License.
