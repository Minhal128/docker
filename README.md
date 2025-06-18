# Authentication Dashboard Application

A simple MERN stack application with authentication and user dashboard.

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard route
- User profile display
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)
- npm or yarn

## Project Structure

```
.
├── backend/             # Node.js/Express backend
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   └── index.js    # Main server file
│   └── package.json
└── frontend/           # Next.js frontend
    ├── pages/         # Next.js pages
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-dashboard
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Create a new account using the signup form
3. Log in with your credentials
4. View your profile information on the dashboard

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

## Dockerization

This application is ready to be dockerized. You can create Dockerfiles for both frontend and backend services, and use Docker Compose to orchestrate them along with MongoDB.

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add input validation and sanitization
- Use HTTPS in production 