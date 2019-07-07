/* tslint:disable:no-console */

import { persistMessagesToMongo } from '../src/spot_persistence'
import * as response from '../test/spot_feed_response.json'

(async () => {
  const result = await persistMessagesToMongo(response.response.feedMessageResponse.messages.message)
  console.log(result)
})()
