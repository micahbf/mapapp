import { RestClient } from 'typed-rest-client/RestClient'

export namespace SpotAPI {
  export interface Message {
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

  interface Feed {
    id: string
    name: string
    description: string
    status: string
    usage: number
    daysRange: number
    detailedMessageShown: boolean
    type: string
  }

  interface SuccessfulResponse {
    response: {
      feedMessageResponse: {
        count: number
        feed: Feed
        totalCount: number
        activityCount: number
        messages: {
          message: Message[]
        }
      }
    }
  }

  interface ErrorResponse {
    response: {
      errors: {
        error: {
          code: string
          text: string
          description: string
        }
      }
    }
  }

  export type FeedResponse = SuccessfulResponse | ErrorResponse

  const userAgent = 'mapapp (micah.motorcycles)'
  const baseUrl = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/'

  export async function getLatestMessages(feedId: string) {
    const client = new RestClient(userAgent, baseUrl)
    const response = await client.get<FeedResponse>(`${feedId}/message.json`)

    return response.result
  }

  export function isError(response: FeedResponse): response is ErrorResponse {
    return (response as ErrorResponse).response.errors !== undefined
  }
}
