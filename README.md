# Meldr_assignment

Pharmacy Management Backend

This repository contains the backend code for a Pharmacy Management System. The system allows users to manage pharmacies and their medicines, with features for user authentication, CRUD operations, pharmacy listing, and caching frequently accessed data.

! Features

- User Authentication: Register and login users using JSON Web Tokens (JWT). Securely store user credentials in MongoDB.
- Pharmacy and Medicine Management: Register multiple pharmacies, manage CRUD operations for medicines, and upload images for medicines.
- Pharmacy Listing: List all registered pharmacies with search functionality by name.
- Caching: Use Redis or Node-cache to cache frequently accessed data such as pharmacy listings.
- Security: Secure storage of passwords, input validation, and JWT-based API protection.

!Technologies Used

- Node.js: JavaScript runtime.
- Express: Web framework for Node.js.
- MongoDB: NoSQL database.
- Mongoose: ODM for MongoDB.
- JWT: JSON Web Tokens for authentication.
- Redis: In-memory data structure store for caching.
- Multer: Middleware for handling multipart/form-data (image uploads).
- bcrypt: Library for hashing passwords.

!Getting Started

!Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.
- Redis installed and running (optional for caching).

!Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pharmacy-management-backend.git
   cd pharmacy-management-backend

!!  install the dependencies:
    npm install

!! Create a .env file in the root directory and add the following environment variables:  
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pharmacy-management
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379

!! Start the server:
   npm start
