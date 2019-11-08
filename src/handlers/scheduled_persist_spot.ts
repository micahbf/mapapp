import { ScheduledHandler } from 'aws-lambda'
import 'source-map-support/register'
import { cacheToS3 } from '../s3_cache'
import { persistSpot } from '../spot_persistence'

export const handle: ScheduledHandler = async () => {
  const result = await persistSpot()
  await cacheToS3()
  console.log(result)
}
