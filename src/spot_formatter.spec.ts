import { SpotMessage } from './spot_api'
import { formatSpotMessage } from './spot_formatter'

const spotMsg: SpotMessage = {
  '@clientUnixTime': '0',
  'id': 1223571014,
  'messengerId': '0-3504223',
  'messengerName': 'Spot',
  'unixTime': 1561333087,
  'messageType': 'UNLIMITED-TRACK',
  'latitude': 37.80856,
  'longitude': -122.27774,
  'modelId': 'SPOT3',
  'showCustomMsg': 'N',
  'dateTime': '2019-06-23T23:38:07+0000',
  'messageDetail': '',
  'batteryState': 'GOOD',
  'hidden': 0,
  'altitude': 2
}

it('converts a SpotMessage to a FormattedMessage with the expected values', () => {
  const formattedMsg = formatSpotMessage(spotMsg)

  expect(formattedMsg._id).toEqual(spotMsg.id)

  expect(formattedMsg.point.coordinates[0]).toEqual(spotMsg.longitude)
  expect(formattedMsg.point.coordinates[1]).toEqual(spotMsg.latitude)
  expect(formattedMsg.time).toEqual(new Date(spotMsg.dateTime))

  expect(formattedMsg.messageType).toEqual(spotMsg.messageType)

  expect(formattedMsg.originalMessage).toEqual(spotMsg)
})
