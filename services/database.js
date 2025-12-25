import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.AWS_REGION || 'us-east-1'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const sessionToken = process.env.AWS_SESSION_TOKEN
const dynamoEndpoint = process.env.DYNAMODB_ENDPOINT

const clientConfig = { region: REGION }

if (dynamoEndpoint) {
  clientConfig.endpoint = dynamoEndpoint
}

if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
    sessionToken
  }
}

const ddbClient = new DynamoDBClient(clientConfig)
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)

export default ddbDocClient
