### backend dev

1.generate git repo
    git init 
2.add .gitignore file

3.create .env file for environmenet variables and read data from .env with "dotenv" module // npm install dotenv

4.genetare json pcked.json
   npm init -y

5.create express app

6.connect to database

7. Add the middlewares(body parser,err handling ,)
 
8.design schema and create models

9.design REST APIS fro all resources 




# Blog App Backend

## Overview
Purpose of backend and API architecture.

## Features
- Authentication
- CRUD Blog APIs
- Database Storage
- Error Handling
- Middleware
- Token Validation

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- cors
- nodemon

## Frameworks and Libraries Used
| Tool | Purpose |
|------|---------|
| Node.js | Runtime |
| Express | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Env configuration |
| cors | Cross-origin access |

## API Architecture
Request → Middleware → Controller → Database → Response

## Folder Structure
controllers/
models/
routes/
middleware/

## Environment Variables
PORT
MONGO_URI
JWT_SECRET
CLIENT_URL

## Installation
npm install

## Run Server
npm run server

## API Endpoints
GET /blogs
POST /blogs
PUT /blogs/:id
DELETE /blogs/:id

## Authentication Flow
Register → Login → JWT → Protected Route

## Database Configuration
MongoDB Atlas connection explanation.

## Deployment
Render deployment steps

## Error Handling
Validation and middleware explanation

## Future Improvements