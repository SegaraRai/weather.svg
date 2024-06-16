# Weather.svg

Weather.svg is a widget that displays weather information.
It is provided as a server that outputs an animated weather widget image in SVG format.

**Leeds, UK** (shown in your preferred language and units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=53.86681894798549&amp;longitude=-1.6584345829082057" alt="Weather in Leeds" style="width:100%" />

**Greenwich, US** (shown in English, regular time, Fahrenheit and imperial units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=41.021247610322455&amp;longitude=-73.62548875414416&amp;lang=en-US&amp;time_format=12h&amp;air_pressure=hpa&amp;precipitation=inch&amp;temperature=fahrenheit&amp;wind_speed=mph" alt="Weather in Connecticut" style="width:100%" />

**Tsukuba, JP** (shown in Japanese, military time, Celsius and metric units)  
<img src="https://weather-svg.abelia.workers.dev/weather.svg?latitude=36.08297932646632&amp;longitude=140.11147093989302&amp;lang=ja-JP&amp;time_format=24hn&amp;air_pressure=hpa&amp;precipitation=mm&amp;temperature=celsius&amp;wind_speed=mps" alt="Weather in Tsukuba" style="width:100%" />

## Usage

Add the following query parameters to the URL of the API server: `https://weather-svg.abelia.workers.dev/weather.svg`.

### Location Parameters

- `latitude`: required, -90 to 90
- `longitude`: required, -180 to 180
- `location`: optional, string  
  Displays this name without reverse geocoding if specified.
- `location_lang`: optional, string  
  Specifies the language of the `location` (e.g., `en-US`).  
  Required if `location` is specified.

These parameters can also be replaced with `encrypted_location`.  
`encrypted_location` can be obtained by adding `&encrypt` to the end of the plain location URL.

### Preference Parameters

All of these parameters are optional.

- `air_pressure`: `auto` (default) / `hpa` / `inhg`
- `precipitation`: `auto` (default) / `mm` / `inch`
- `temperature`: `auto` (default) / `celsius` / `fahrenheit`
- `wind_speed`: `auto` (default) / `mps` / `kmph` / `mph` / `knot`  
  Note that `mph` means miles per hour, while `mps` means meters per second.
- `time_format`: `auto` (default) / `12h` / `24h` / `24hn` / `native`  
  `24hn` means 24-hour notation with no leading zero.  
  `native` means the native datetime format (including year) of the language.
- `lang`: `auto` (default) / BCP 47 tag, e.g., `en-US`  
  Specifies the language of the weather information, the datetime format, and the location name if `location` not provided.  
  Detected automatically from `Accept-Language` header if `auto` is specified.

### Examples

- `https://weather-svg.abelia.workers.dev/weather.svg?latitude=36.08297932646632&longitude=140.11147093989302`
- `https://weather-svg.abelia.workers.dev/weather.svg?latitude=41.945053494801634&longitude=-72.64589591337739&lang=en-US&time_format=12h&precipitation=inch&temperature=fahrenheit&wind_speed=mph`

## Development

Before starting development, install Node.js and pnpm.  
Required versions are specified in `package.json`.  
We recommend using [proto](https://moonrepo.dev/proto) to install tools.

1. Clone this repository.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm dev` to start the development Vite server.
4. Create `.dev.vars` based on `.dev.vars.example` and fill in the values.
5. Run `pnpm preview` to preview the API server.

## Deployment

1. Edit `wrangler.toml` to match your Cloudflare account and Workers KV namespace id.
2. Run `pnpm wrangler secret put` to set the required secrets.  
   See `src/server/bindings.ts` for the required secrets.
3. Run `pnpm wrangler deploy` to deploy your API server.

Make sure to add `CLOUDFLARE_API_TOKEN` to GitHub Actions secrets to deploy automatically.  
See [Create an API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) for more information.

## Contribution

Open an issue for any bug or feature request.  
Pull requests are also welcome.

## License

This project is licensed under the MIT License.

## Credits

- Weather data by [Open-Meteo](https://open-meteo.com/), CC BY 4.0.
- Locality data by [BigDataCloud](https://www.bigdatacloud.com/).
- Icons from [Meteocons by Bas Milius](https://bas.dev/work/meteocons), MIT License.
