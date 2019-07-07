/* tslint:disable:no-console */

import { persistSpot } from '../src/spot_persistence'

(async () => {
  const result = await persistSpot()
  console.log(result)
})()
