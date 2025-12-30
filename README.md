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

- Node.js (16+)
- npm
- Docker (optional, for running DynamoDB Local or containerizing the app)
- AWS account and credentials (only required if you plan to provision or use AWS DynamoDB)

Clone and install

```bash
git clone https://github.com/ZainabSameer/RESTful-Microservice-with-Express-Project.git
cd RESTful-Microservice-with-Express-Project
npm install
```

### Environment

Copy the example environment file and fill in your credentials (DO NOT commit a real `.env`):

```bash
cp .env.example .env
# Edit .env and set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION / COFFEE_TABLE (optional)
```

Notes on credentials

- You can either set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env` (local dev) or rely on the AWS CLI configured profile / environment variables / IAM role. The app will use the default AWS SDK credential chain when env variables are not present.
- `.env` is ignored by git (see `.gitignore`).

## Provision DynamoDB with Terraform (AWS)

The repo includes Terraform configuration in `infra/terraform/` to create the DynamoDB table used by the app. This will create a real table in your AWS account.

Steps:

1. Install Terraform: https://developer.hashicorp.com/terraform/downloads
2. Export AWS credentials in your shell (or make sure your AWS CLI is configured):

```bash
export AWS_ACCESS_KEY_ID=YOUR_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET
export AWS_REGION=us-east-1
```

3. Initialize and apply Terraform:

```bash
cd infra/terraform
terraform init
terraform apply -var="table_name=Coffees"
# Type 'yes' to confirm when prompted
```

4. After apply, the table will exist in your AWS account. Destroy it when finished:

```bash
terraform destroy -var="table_name=Coffees"
```

## Run DynamoDB locally with Docker Compose (development)

If you prefer to develop without touching AWS, run DynamoDB Local in Docker:

```bash
docker compose up -d
```

This launches a DynamoDB Local container accessible at `http://localhost:8000`.

Create the table locally using the AWS CLI (point at the local endpoint):

```bash
aws dynamodb create-table \
  --table-name Coffees \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000 \
  --region us-east-1
```

When running against DynamoDB Local you can set dummy AWS credentials in `.env`:

```
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
DYNAMODB_ENDPOINT=http://localhost:8000
```

The `services/database.js` file will pick up `DYNAMODB_ENDPOINT` and use it when present.

## Run the server

### Locally (npm)

```bash
npm run dev
```

By default the server listens on port `3002` (set `PORT` in `.env` to override).

Base URL:

```
http://localhost:3002
```

### With Docker (run the server in a container)

Build the image and run the container (example exposes port 3002):

```bash
docker build -t coffee-service .
docker run -p 3002:3002 --env-file .env coffee-service
```

If you want to run the app container and DynamoDB Local together, first run `docker compose up -d` (to start DynamoDB Local) and then start the app container with `DYNAMODB_ENDPOINT=http://host.docker.internal:8000` (on Windows/Mac) or adjust networking as needed.

## API — Interact with the service

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

## Technologies used

- Node.js
- Express
- AWS SDK for JavaScript (v3) — `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`
- DynamoDB (AWS)
- Joi for request validation
- uuid for generating ids
- dotenv for environment loading
- nodemon for development

## Attributions

- Built with Express (https://expressjs.com/)
- AWS SDK for JavaScript (https://github.com/aws/aws-sdk-js-v3)

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
curl http://localhost:3002/coffees
```

Attributions

- Built with Express (https://expressjs.com/)
- AWS SDK for JavaScript (https://github.com/aws/aws-sdk-js-v3)
