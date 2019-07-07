import { Db, MongoClient } from 'mongodb'
import { parse } from 'url'
import { mongoUrl } from './config'

export async function mongoDb(): Promise<Db> {
  const connection = await MongoClient.connect(mongoUrl)
  return connection.db(parse(mongoUrl).pathname.slice(1))
}
