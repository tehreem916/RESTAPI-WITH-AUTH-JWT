# REST API with JWT Authentication

A RESTful API built with **Node.js, Express.js, MongoDB, and Mongoose**. The project provides secure user authentication using **JWT**, protected CRUD operations for **Tasks and Projects**, and centralized error handling through middleware.

##  Features

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* Complete CRUD operations for Tasks
* Complete CRUD operations for Projects
* MongoDB database integration using Mongoose
* User-specific data access
* Authentication middleware
* Centralized error-handling middleware
* Environment variables for sensitive configuration

## Technologies Used

* **Node.js** — JavaScript runtime
* **Express.js** — REST API framework
* **MongoDB** — Database
* **Mongoose** — MongoDB ODM
* **JWT (jsonwebtoken)** — Authentication
* **bcryptjs** — Password hashing
* **dotenv** — Environment variable management

## 📁 Project Structure

```text
rest-api-auth/
│
├── models/
│   ├── User.js
│   ├── Task.js
│   └── Project.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── .env
```

> `.env` is excluded from Git using `.gitignore` and should never be committed to the repository.

##  Authentication

The API uses **JWT (JSON Web Tokens)** to protect private routes.

### Register

```http
POST /api/auth/register
```

Request body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

A successful login returns a JWT token.

Use the token when accessing protected routes:

```http
Authorization: Bearer YOUR_TOKEN
```

##  Task API

All task routes require authentication.

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/tasks`     | Get all user's tasks |
| GET    | `/api/tasks/:id` | Get a specific task  |
| POST   | `/api/tasks`     | Create a new task    |
| PUT    | `/api/tasks/:id` | Update a task        |
| DELETE | `/api/tasks/:id` | Delete a task        |

### Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Complete REST API assignment",
  "completed": false
}
```

Each task is associated with the authenticated user, so users can only access their own tasks.

## 📂 Project API

All project routes require authentication.

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/projects`     | Get all user's projects |
| GET    | `/api/projects/:id` | Get a specific project  |
| POST   | `/api/projects`     | Create a new project    |
| PUT    | `/api/projects/:id` | Update a project        |
| DELETE | `/api/projects/:id` | Delete a project        |

### Create Project

```http
POST /api/projects
```

```json
{
  "name": "My Web Application",
  "description": "A full-stack web application project"
}
```

Projects are also associated with the authenticated user.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/tehreem916/RESTAPI-WITH-AUTH-JWT
```

### 2. Navigate into the project

```bash
cd rest-api-auth
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Do not share or commit your `.env` file.

### 5. Start the server

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

## 🧪 Testing

The API can be tested using tools such as **Postman**.

Recommended testing flow:

1. Register a user
2. Login to receive a JWT token
3. Add the token to the Authorization header
4. Create a Task or Project
5. Read the resource
6. Update the resource
7. Delete the resource

Example authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Security

* Passwords are hashed using **bcryptjs** before being stored.
* JWT tokens are used to authenticate protected requests.
* Sensitive configuration is stored in environment variables.
* `.env` is excluded from version control.
* Users can only access Tasks and Projects belonging to their own account.

## Learning Objectives

This project was developed to practice and understand:

* Building RESTful APIs with Express
* Designing MongoDB schemas with Mongoose
* Implementing JWT authentication
* Password hashing
* Creating authentication middleware
* Creating centralized error-handling middleware
* Implementing CRUD operations
* Working with protected routes
* Managing environment variables
* Connecting a Node.js application to MongoDB

## 👩‍💻 Author

**Tehreem Fatima**

BS Software Engineering
