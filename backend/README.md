# Refactor Period Prediction Backend

## Overview

This project is a backend application for the Refactor Period Prediction system. It provides user authentication, including OAuth support for Google, Facebook, GitHub, and LinkedIn, as well as user registration and login functionalities. The application is built using Node.js and Express, and it utilizes PostgreSQL for data storage.

## Features

- User registration and login
- OAuth authentication with Google, Facebook, GitHub, and LinkedIn
- JWT-based authentication for secure API access
- Environment variable management for sensitive information

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- A valid OAuth application setup for Google, Facebook, GitHub, and LinkedIn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd refactor-period-prediction/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory and populate it with the required environment variables. You can use the provided `.env.example` as a reference.

4. Start the server:
   ```
   npm run dev
   ```

### Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
DATABASE_URL='your_database_url'
JWT_SECRET='your_jwt_secret'
GOOGLE_CLIENT_ID='your_google_client_id'
GOOGLE_CLIENT_SECRET='your_google_client_secret'
FACEBOOK_APP_ID='your_facebook_app_id'
FACEBOOK_APP_SECRET='your_facebook_app_secret'
GITHUB_CLIENT_ID='your_github_client_id'
GITHUB_CLIENT_SECRET='your_github_client_secret'
LINKEDIN_CLIENT_ID='your_linkedin_client_id'
LINKEDIN_CLIENT_SECRET='your_linkedin_client_secret'
```

### API Endpoints

- **POST /api/register**: Register a new user.
- **POST /api/login**: Log in an existing user.
- **GET /auth/google**: Authenticate with Google.
- **GET /auth/facebook**: Authenticate with Facebook.
- **GET /auth/github**: Authenticate with GitHub.
- **GET /auth/linkedin**: Authenticate with LinkedIn.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.
