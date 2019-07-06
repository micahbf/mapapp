import { Db, MongoClient } from 'mongodb'
import { parse } from 'url'

const mongoUrl = process.env.MONGO_URL

export async function mongoDb(): Promise<Db> {
  const connection = await MongoClient.connect(mongoUrl)
  return connection.db(parse(mongoUrl).pathname)
}
