# Weather.svg

Weather.svg is a widget that displays weather information.
It is provided as a server that outputs an animated weather widget image in SVG format.

<!-- Example Image Here -->

## Usage

Specify the following query parameters at `https://.../weather.svg`

### Location Parameters

- `latitude`: required, -90 to 90
- `longitude`: required, -180 to 180
- `location`: optional, string
  Displays this name without reverse geocoding if specified.
- `location_lang`: optional, string
  Specifies the language of the `location` (e.g., `en-US`).
  Required if `location` is specified.

These parameters can also be replaced with `encrypted_location`.

### Preference Parameters

All of these parameters are optional.

- `air_pressure`: `hpa` (default) / `inhg`
- `precipitation`: `mm` (default) / `in`
- `temperature`: `celsius` (default) / `fahrenheit`
- `wind_speed`: `mps` (default) / `kmph` / `mph` / `knot`
- `time_format`: `auto` (default) / `12h` / `24h` / `24hn`
- `lang`: `auto` (default) / BCP 47 tag, e.g., `en-US`

## Contribution

TODO

## Credits

- Weather data by Open-Meteo
- Reverse geocoding by BigDataCloud
- Icon by Meteocons
