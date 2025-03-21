### Electron App Template

This app template includes:

- Electron
- React
- Typescript
- Express
- Jest
- React Testing Library
- Mocha

#### Prerequisites

1. Weather information - it is using the [Openweathermap](https://openweathermap.org/) API, so a key is required.
2. Additionally, the location coordinates is also required in this file `src/config/config.ts` with the info below

```
export const coords = {
  country: 'GB',
  lat: 123432
  lon: 0.3243434,
  name: 'Town',
  zip: 'post/zip code'
}
```

you can get the coordinates on this [page](https://openweathermap.org/api/geocoding-api) and make the API `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`

3. Home Assistant - A long live token is required. Enter the `HA_HOST=<HOST_IP>` and `HA_LONG_LIVE_TOKEN=<TOKEN>` in the `src/config/.env` file.

#### Setup

The app plays music in the `music` folder and videos in the `media` folder. If there is a central place for these media, a good option is to mount these folders so they don't need to be moved or copied.

To run the app, enter:

```
npm run dev
```

#### Run Tests

To run the unit test

```
npm test
```

To run the acceptance test

```
npm run test:acceptance
```
