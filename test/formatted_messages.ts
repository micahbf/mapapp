import * as fs from 'fs'
import { FormattedMessage } from '../src/spot_format'

interface FormattedMessageJSON extends Omit<FormattedMessage, 'time'> {
  time: string
}

function loadFormattedMessages(): FormattedMessage[] {
  const jsonPath = `${__dirname}/raw_formatted_messages.json`
  const fileBuffer = fs.readFileSync(jsonPath)
  const messageJson = JSON.parse(fileBuffer.toString()) as FormattedMessageJSON[]
  return messageJson.map(msg => ({...msg, time: new Date(msg.time)}))
}

export default loadFormattedMessages()
