# RESTful Microservice with Express (Coffee Service)

A small Express microservice that provides CRUD operations for coffee items stored in Amazon DynamoDB.

Each coffee item has the shape:

- id (UUID)
- name (string)
- origin (string | null)
- roast (string | null)
- createdAt (ISO 8601 string)

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

Environment

Copy the example environment file and fill in your credentials (DO NOT commit a real `.env`):

```bash
cp .env.example .env
# Edit .env and set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION / COFFEE_TABLE (optional)
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

Example curl (create):

```bash
curl -X POST http://localhost:3002/coffees \
  -H "Content-Type: application/json" \
  -d '{"name":"Kenya AA","origin":"Kenya","roast":"Medium"}'
```

Example curl (read all):

```bash
curl http://localhost:3002/coffees
```

Using Postman

- Create an environment variable `base_url`, e.g. `http://localhost:3002`.
- POST to `{{base_url}}/coffees` with JSON body `{ "name": "..." }`.
- In the POST request Tests tab you can save the returned id to a variable `coffeeId`:

```javascript
if (pm.response.code === 201) {
  const body = pm.response.json()
  if (body.id) pm.environment.set('coffeeId', body.id)
}
```

Then use `{{base_url}}/coffees/{{coffeeId}}` for GET/PUT/DELETE.

Validation

- The API validates incoming create/update payloads using Joi and returns 400 with details if validation fails.

Technologies used

- Node.js
- Express
- AWS SDK for JavaScript (v3) — `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`
- DynamoDB (AWS)
- Joi for request validation
- uuid for generating ids
- dotenv for environment loading
- nodemon for development

Project structure (important files)

- `index.js` — app entry
- `views/router.js` — route definitions
- `controllers/coffeeController.js` — request handlers and validation
- `services/dynamo.js` — DynamoDB Document client wrapper
- `models/coffee.js` — Joi schema for coffee items
- `.env.example` — example environment variables

Attributions

- Built with Express (https://expressjs.com/)
- AWS SDK for JavaScript (https://github.com/aws/aws-sdk-js-v3)
- Joi validation library (https://github.com/sideway/joi)

License

This project is provided as-is (no license specified). Add a LICENSE file if you plan to distribute it.

# RESTful-Microservice-with-Express-Project
