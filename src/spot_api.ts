import { RestClient } from 'typed-rest-client/RestClient'

export interface SpotMessage {
  '@clientUnixTime': string
  id: number
  messengerId: string
  messengerName: string
  unixTime: number
  messageType: string
  latitude: number
  longitude: number
  modelId: string
  showCustomMsg: string
  dateTime: string
  messageDetail: string
  batteryState: string
  hidden: number
  altitude: number
}

interface SpotFeed {
  id: string
  name: string
  description: string
  status: string
  usage: number
  daysRange: number
  detailedMessageShown: boolean
  type: string
}

interface SpotFeedResponse {
  response: {
    feedMessageResponse: {
      count: number
      feed: SpotFeed
      totalCount: number
      activityCount: number
      messages: {
        message: SpotMessage[]
      }
    }
  }
}

export class SpotAPI {
  public static async getLatestMessages(feedId: string) {
    const client = new RestClient(SpotAPI.userAgent, SpotAPI.baseUrl)
    const response = await client.get<SpotFeedResponse>(`${feedId}/message.json`)

    return response.result.response.feedMessageResponse.messages.message
  }

  private static userAgent = 'mapapp (micah.motorcycles)'
  private static baseUrl = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/'
}
