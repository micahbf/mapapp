import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import { parseIsoDate } from '../date_utils'
import { lastUpdateCaption, mapBounds } from '../map_metadata'
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
  const bounds = mapBounds(messages, 2)
  const updateCaption = lastUpdateCaption(messages)
  const body = {bounds, updateCaption}

  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: defaultHeaders
  }
}
