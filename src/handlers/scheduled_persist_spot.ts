import { ScheduledHandler } from 'aws-lambda'
import 'source-map-support/register'
import { persistSpot } from '../spot_persistence'

export const handle: ScheduledHandler = async () => {
  const result = await persistSpot()
  console.log(result)
}
