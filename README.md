# Project Title: Refactor Period Prediction

## Overview

This project is designed to provide a robust and secure web application for user authentication and survey management. It utilizes OAuth for social login and JWT for secure session management.

## Project Structure

The project is divided into two main parts: the backend and the frontend.

### Backend

The backend is built using Node.js and Express. It handles user authentication, database interactions, and API endpoints.

- **src/config/passport.js**: Configures Passport strategies for OAuth authentication (Google, Facebook, GitHub, LinkedIn).
- **src/middleware/authenticate.js**: Middleware for JWT authentication, verifying tokens and attaching user information to requests.
- **src/routes/api.js**: Defines API routes for the application, handling various endpoints.
- **src/routes/auth.js**: Manages user registration and login, including OAuth callback handling.
- **src/utils/jwt.js**: Utility functions for generating and verifying JWT tokens.
- **src/app.js**: Initializes the Express application, sets up middleware, and configures routes.
- **src/server.js**: Starts the server and listens on the specified port.
- **.env**: Contains environment variables for database connection, JWT secret, and OAuth credentials.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **README.md**: Documentation for the backend application.

### Frontend

The frontend is built using HTML, CSS, and JavaScript. It provides a user-friendly interface for authentication and survey participation.

- **public/index.html**: Main HTML file serving as the entry point for the web application.
- **public/login.html**: HTML structure for the signup and login forms.
- **public/favicon.ico**: Favicon for the web application.
- **src/assets/styles/login.css**: CSS styles for the signup and login forms.
- **src/js/index.js**: JavaScript code for handling user interactions and API calls.
- **src/js/login.js**: JavaScript code for managing form submissions and user feedback.
- **src/README.md**: Documentation for the frontend application.
- **package.json**: Configuration file for npm, listing dependencies and scripts.

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd refactor-period-prediction
   ```

2. Navigate to the backend directory and install dependencies:

   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory and populate it with your environment variables. Refer to the `.env.example` for the required variables.

4. Start the backend server:

   ```
   npm run dev
   ```

5. Navigate to the frontend directory and install dependencies:

   ```
   cd ../frontend
   npm install
   ```

6. Open the `public/index.html` file in your browser to access the application.

## Usage

- Users can register and log in using their email or social media accounts.
- After logging in, users can participate in surveys and view their results.

## Security Considerations

- Ensure that the `.env` file is not exposed in version control.
- Use HTTPS in production to secure data in transit.
- Regularly update dependencies to mitigate vulnerabilities.

## License

This project is licensed under the MIT License.
