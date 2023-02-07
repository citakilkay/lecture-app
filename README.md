
## Running the app

Terminal 1
```bash
$ npm install
$ docker compose up postgres-cont
``` 

Terminal 2
```bash
$ npm run start:dev
$ go to for SwaggerUI --> localhost:3000/api
```

## Entities
 * Lecture
 * Franchise
 * User

## Technologies
 * NestJS
 * PostgreSQL
 * Docker
 * TypeORM
 * SwaggerUI

 ## Roles
 * SuperAdmin: Can create, update, delete users and franchisees
 * Admin: Can create, update, delete lectures for own franchisee
 * Student: Can Attend and Abandon lectures, Can see lectures in own franchisee
 * Lecturer: Every Lecture must have a lecturer before insert


