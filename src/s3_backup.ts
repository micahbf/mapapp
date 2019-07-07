import { S3 } from 'aws-sdk'
import { backupS3Bucket } from './config'

const s3 = new S3()

export function backupToS3(name: string, obj: any) {
  const currentTime = new Date().toISOString()
  const key = `${currentTime}_${name}.json`
  let body: string

  if (typeof obj === 'string') {
    body = obj
  } else {
    body = JSON.stringify(obj)
  }

  s3.putObject({Key: key, Bucket: backupS3Bucket, Body: body}, (err) => {
    if (err) {
      console.log(err)
      return false
    } else {
      return true
    }
  })
}
