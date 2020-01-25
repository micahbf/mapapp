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
