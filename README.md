# Mapapp

This is a small app which:
1. Regularly pulls the tracking feed from a SPOT Gen3 tracker
2. Persists this tracking data to a Mongo database
3. Backs up the raw API data to an S3 bucket
4. Exposes the tracking data in GeoJSON format for use in a map (I use [Mapbox](https://mapbox.com))
5. Exposes the tracking data as GPX
6. Provides several other utility functions and endpoints

It runs on AWS Lambda using the [serverless.js](https://serverless.com) framework.

## Usage

To get started, pull the repo and run `yarn install`.

If you want to use it locally, take a look at [config.ts](src/config.ts) for what environment variables need to be set. You may use a `.env` file.

If you want to deploy it, you'll need to set up AWS auth, and then go through [serverless.yml](serverless.yml) and change all of the things specific to my setup. Then, run `sls deploy`.

To run tests, run `yarn test`.

## Endpoints and Functions

- `/gpx` - exposes the tracking data as GPX
  - Requires a `from` URL param with an ISO8601 datetime for when the tracking data should start
  - Optional `to` URL param for when the tracking data should stop
- `/map_data` - exposes the tracking data as GeoJSON, optimized for use in a map
  - Requires a `from` URL param with an ISO8601 datetime for when the tracking data should start
  - Optional `to` URL param for when the tracking data should stop
- `/map_metadata` - exposes some metadata to help rendering the map before loading the tracking data, such as map bounds
  - Requires a `from` URL param with an ISO8601 datetime for when the tracking data should start
  - Optional `to` URL param for when the tracking data should stop
- `/one_off_persist` - allows adding a single trackpoint to the database "manually." The trackpoint time is assumed to be now.
  - Requires `lat` and `lon` parameters
  - Requires a `password` parameter that must match the `PERSIST_PASSWORD` env var
- `/realtime_track` - A more basic GeoJSON endpoint with just a linestring of the tracking data
  - Requires a `from` URL param with an ISO8601 datetime for when the tracking data should start
  - Optional `to` URL param for when the tracking data should stop
- `scheduledPersistSpot` - Scheduled lambda function to pull the SPOT API data and persist it
