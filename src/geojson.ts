import { GeoJsonProperties } from 'geojson'

export function pointsToLineString(points: GeoJSON.Point[]): GeoJSON.LineString {
  const coordinates = points.map(pt => pt.coordinates)
  return {
    type: 'LineString',
    coordinates
  }
}

export function wrapWithFeature(geometry: GeoJSON.Geometry, props?: GeoJsonProperties): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry,
    properties: (props || {})
  }
}

export function collectFeatures(features: GeoJSON.Feature[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features
  }
}
