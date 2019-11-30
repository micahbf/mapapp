import { APIGatewayProxyHandler } from 'aws-lambda'
import * as querystring from 'querystring'
import 'source-map-support/register'
import { persistPassword } from '../config'
import { persistOneOffNow } from '../one_off_persistence'
import { cacheToS3 } from '../s3_cache'
import { postHeaders } from './utils'

export const handle: APIGatewayProxyHandler = async (event, _context) => {
  const bodyParams = querystring.parse(event.body)
  const {lat, lon, password} = bodyParams
  const parsedLat = parseFloat(lat as string)
  const parsedLon = parseFloat(lon as string)

  if (!(parsedLat && parsedLon && password)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: 'missing one or more required parameters'
      }),
      headers: postHeaders
    }
  }

  if (password !== persistPassword) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        message: 'incorrect password'
      }),
      headers: postHeaders
    }
  }

  const persistenceResult = await persistOneOffNow(parsedLat, parsedLon)
  if (persistenceResult.success) { await cacheToS3 }

  const statusCode = persistenceResult.success ? 200 : 500

  return {
    statusCode,
    body: JSON.stringify(persistenceResult),
    headers: postHeaders
  }
}
