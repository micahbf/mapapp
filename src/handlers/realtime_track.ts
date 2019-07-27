import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { isValidDateString, parseIsoDate } from '../date_utils'
import { pointsToLineString, wrapWithFeature } from '../geojson'
import { getMessagesFromMongo } from '../spot_persistence'

export const handle: APIGatewayProxyHandler = async (event, _context) => {
  const queryParams = event.queryStringParameters

  const paramErrors = queryParamErrors(queryParams)
  if (paramErrors.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({errors: paramErrors})
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
    body: JSON.stringify(geojson)
  }
}

function queryParamErrors(queryParams: void | {[name: string]: string}): string[] {
  const errors = []

  if (!queryParams) {
    errors.push('Must provide a "from" param with a valid ISO date')
    return errors
  }

  if (!queryParams.from || !isValidDateString(queryParams.from)) {
    errors.push('Must provide a "from" param with a valid ISO date')
  }

  if (queryParams.to && !isValidDateString(queryParams.to)) {
    errors.push('Param "to" must be a valid ISO date if provided')
  }

  return errors
}
