import { S3 } from 'aws-sdk'

const bucket = process.env.BACKUP_S3_BUCKET
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

  s3.putObject({Key: key, Bucket: bucket, Body: body}, (err) => {
    if (err) {
      return false
    } else {
      return true
    }
  })
}
