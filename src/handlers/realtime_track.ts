import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { parseIsoDate } from '../date_utils'
import { pointsToLineString, wrapWithFeature } from '../geojson'
import { getMessagesFromMongo } from '../spot_persistence'
import { validateFromTo } from './param_validations'
import { defaultHeaders } from './utils'

export const handle: APIGatewayProxyHandler = async (event, _context) => {
  const queryParams = event.queryStringParameters

  const paramErrors = validateFromTo(queryParams)
  if (paramErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({errors: paramErrors}),
      headers: defaultHeaders
    }
  }

  const from = parseIsoDate(queryParams.from)
  let to: Date | void
  if (queryParams.to) { to = parseIsoDate(queryParams.to) }

  const messages = await getMessagesFromMongo(from, to)
  const points = messages.map(msg => msg.point)
  const geojson = wrapWithFeature(pointsToLineString(points))

  return {
    statusCode: 200,
    body: JSON.stringify(geojson),
    headers: defaultHeaders
  }
}
