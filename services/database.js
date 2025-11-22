import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.AWS_REGION


const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const clientConfig = { region: REGION }
if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey
  }
}

const ddbClient = new DynamoDBClient(clientConfig)
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)

export default ddbDocClient
