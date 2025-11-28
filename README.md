# RESTful Microservice with Express (Coffee Service)

A small Express microservice that provides CRUD operations for coffee items stored in Amazon DynamoDB.

Each coffee item has the shape:

- id 
- name
- origin
- roast 
- createdAt 

## Getting started

Prerequisites

- Node.js 
- npm
- AWS account 

Clone and install

```bash
git clone <https://github.com/ZainabSameer/RESTful-Microservice-with-Express-Project.git>
cd RESTful-Microservice-with-Express-Project
npm install
```

Notes on credentials

- You can either set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env` (local dev) or rely on the AWS CLI configured profile / environment variables / IAM role. The app will use the default AWS SDK credential chain when env variables are not present.
- `.env` is ignored by git (see `.gitignore`).

Create the DynamoDB table

The app expects a DynamoDB table with a string primary key named `id`. By default the table name is `Coffees` (override using `COFFEE_TABLE` in `.env`).

Create it with AWS CLI:

```bash
aws dynamodb create-table \
  --table-name ${COFFEE_TABLE:-Coffees} \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ${AWS_REGION:-us-east-1}
```

Run the app

```bash
npm run dev
```

The server listens on the `PORT` environment variable (default set in `.env.example` as 3002). Example base URL:

```
http://localhost:3002
```

Interact with the API

Endpoints (JSON)

- POST /coffees — create a coffee. Body: { name, origin?, roast? } (returns 201 and created item)
- GET /coffees — list all coffees
- GET /coffees/:id — get one coffee
- PUT /coffees/:id — update coffee (supply at least one of name/origin/roast)
- DELETE /coffees/:id — delete coffee

```bash
curl -X POST http://localhost:3002/coffees \
  -H "Content-Type: application/json" \
  -d '{"name":"Kenya AA","origin":"Kenya","roast":"Medium"}'
```

Example curl (read all):

```bash
curl http://localhost:3002/coffees
```


Attributions

- Built with Express (https://expressjs.com/)
- AWS SDK for JavaScript (https://github.com/aws/aws-sdk-js-v3)
