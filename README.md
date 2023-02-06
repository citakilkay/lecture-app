
## Running the app

```bash
$ npm install
$ docker compose up postgres-cont
$ npm run start:dev
$ localhost:3000/api
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

 ## Roles
 * SuperAdmin: Can create, update, delete users and franchisees
 * Admin: Can create, update, delete lectures for own franchisee
 * Student: Can Attend and Abandon lectures
 * Lecturer: Every Lecture must have a lecturer before insert


