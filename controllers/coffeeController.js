import ddbDocClient from '../services/database.js'
import { v4 as uuidv4 } from 'uuid'
import {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'

const TABLE = process.env.COFFEE_TABLE || 'Coffees'

export async function createCoffee(req, res) {
  try {
    const { name, origin, roast } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })

    const item = {
      id: uuidv4(),
      name,
      origin: origin || null,
      roast: roast || null,
      createdAt: new Date().toISOString()
    }

    await ddbDocClient.send(new PutCommand({ TableName: TABLE, Item: item }))
    return res.status(201).json(item)
  } catch (err) {
    console.error('createCoffee error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCoffees(req, res) {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: TABLE }))
    return res.json({ items: data.Items || [] })
  } catch (err) {
    console.error('getCoffees error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getCoffeeById(req, res) {
  try {
    const { id } = req.params
    const data = await ddbDocClient.send(
      new GetCommand({ TableName: TABLE, Key: { id } })
    )
    if (!data.Item) return res.status(404).json({ error: 'Not found' })
    return res.json(data.Item)
  } catch (err) {
    console.error('getCoffeeById error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateCoffee(req, res) {
  try {
    const { id } = req.params
    const { name, origin, roast } = req.body
    const expr = []
    const values = {}
    if (name !== undefined) {
      expr.push('#n = :name')
      values[':name'] = name
    }
    if (origin !== undefined) {
      expr.push('origin = :origin')
      values[':origin'] = origin
    }
    if (roast !== undefined) {
      expr.push('roast = :roast')
      values[':roast'] = roast
    }

    if (expr.length === 0)
      return res.status(400).json({ error: 'No fields to update' })

    const params = {
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'set ' + expr.join(', '),
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW'
    }

    if (name !== undefined) {
      params.ExpressionAttributeNames = { '#n': 'name' }
    }

    const data = await ddbDocClient.send(new UpdateCommand(params))
    return res.json(data.Attributes)
  } catch (err) {
    console.error('updateCoffee error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteCoffee(req, res) {
  try {
    const { id } = req.params
    await ddbDocClient.send(
      new DeleteCommand({ TableName: TABLE, Key: { id } })
    )
    return res.status(204).send()
  } catch (err) {
    console.error('deleteCoffee error', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
