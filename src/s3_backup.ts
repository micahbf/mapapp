import { S3 } from 'aws-sdk'
import { backupS3Bucket } from './config'

const s3 = new S3()

export async function backupToS3(name: string, obj: any) {
  const currentTime = new Date().toISOString()
  const key = `${currentTime}_${name}.json`
  let body: string

  if (typeof obj === 'string') {
    body = obj
  } else {
    body = JSON.stringify(obj)
  }

  try {
    return await s3.putObject({Key: key, Bucket: backupS3Bucket, Body: body}).promise()
  } catch (e) {
    console.log(e)
    return false
  }
}
