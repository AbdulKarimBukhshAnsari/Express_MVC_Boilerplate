# Express MVC Boilerplate 

A production-ready Express.js boilerplate following MVC architecture with modern JavaScript (ES6+), MongoDB integration, JWT authentication, file uploads, and comprehensive error handling.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Usage Guide](#-usage-guide)
- [API Development](#-api-development)
- [Developer Benefits](#-developer-benefits)
- [Best Practices](#-best-practices)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **MVC Architecture**: Clean separation of concerns with Models, Views (JSON responses), and Controllers
- **Modern JavaScript**: ES6+ syntax with import/export modules
- **Authentication**: JWT-based authentication with access and refresh tokens
- **File Upload**: Multer middleware integrated with Cloudinary for file storage
- **Database**: MongoDB with Mongoose ODM for schema modeling
- **Security**: 
  - Password hashing with bcrypt
  - CORS configuration
  - Cookie-based token storage
- **Error Handling**: 
  - Custom error classes
  - Async error wrapper
  - Standardized API responses
- **Middleware Support**: Ready-to-use authentication and file upload middlewares
- **Production Ready**: Environment configuration and proper project structure

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (for file uploads)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AbdulKarimBukhshAnsari/Express_MVC_Boilerplate.git
cd Express_MVC_Boilerplate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Update Database Name

Edit `src/constants.js` to set your database name:

```javascript
export const DB_NAME = 'your_actual_database_name';
```

### 5. Start the Development Server

```bash
npm run dev
```

Or start with node:

```bash
node src/index.js
```

Your server will be running at `http://localhost:8000`

## 📁 Project Structure

```
Express_MVC_Boilerplate/
├── public/                 # Static files
│   ├── assets/            # Static assets (images, css, js)
│   └── temp/              # Temporary file storage for uploads
├── src/
│   ├── app.js             # Express app configuration
│   ├── index.js           # Application entry point
│   ├── constants.js       # Application constants
│   ├── controllers/       # Request handlers
│   │   └── user.controller.js
│   ├── db/               # Database configuration
│   │   └── index.js      # MongoDB connection
│   ├── middlewares/      # Custom middlewares
│   │   ├── auth.middleware.js    # JWT authentication
│   │   └── multer.middleware.js  # File upload handling
│   ├── models/           # Mongoose schemas
│   │   └── user.model.js # User model with JWT methods
│   ├── routes/           # API routes
│   │   └── user.route.js # User routes
│   ├── services/         # Business logic layer (empty - ready for your services)
│   └── utils/            # Utility functions
│       ├── ApiError.js   # Custom error class
│       ├── ApiResponse.js # Standardized response class
│       ├── asyncHandler.js # Async error wrapper
│       └── cloudinary.js  # Cloudinary upload utility
├── package.json
└── README.md
```

## 🔧 Environment Setup

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017`

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and add to `.env`

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from dashboard
3. Add credentials to `.env` file

## 📖 Usage Guide

### Creating Your First Controller

1. **Create Controller Function** in `src/controllers/user.controller.js`:

```javascript
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;
    
    // Validation
    if ([userName, email, fullName, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    // Check if user exists
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    
    // Create user
    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        password,
        avatar: req.files?.avatar?.[0]?.path || "",
        coverImage: req.files?.coverImage?.[0]?.path || ""
    });
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };
```

2. **Add Route** in `src/routes/user.route.js`:

```javascript
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

export default userRouter;
```

### Using Authentication Middleware

```javascript
import verifyJwt from "../middlewares/auth.middleware.js";

// Protected route
userRouter.route("/profile").get(verifyJwt, getUserProfile);
```

### File Upload with Cloudinary

The boilerplate includes automatic file upload to Cloudinary:

```javascript
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadFile = asyncHandler(async (req, res) => {
    const localFilePath = req.file?.path;
    
    if (!localFilePath) {
        throw new ApiError(400, "File is required");
    }
    
    const uploadResult = await uploadOnCloudinary(localFilePath);
    
    if (!uploadResult) {
        throw new ApiError(500, "Error uploading file");
    }
    
    return res.status(200).json(
        new ApiResponse(200, { url: uploadResult.url }, "File uploaded successfully")
    );
});
```

## 🔨 API Development

### Standard Response Format

All API responses follow this structure:

```javascript
// Success Response
{
    "data": { /* your data */ },
    "statusCode": 200,
    "success": true,
    "message": "Success message"
}

// Error Response
{
    "statusCode": 400,
    "message": "Error message",
    "errors": [],
    "data": null,
    "success": false
}
```

### Creating New Models

```javascript
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    // Add your fields here
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
```

## 🎯 Developer Benefits

### 1. **Rapid Development**
- Pre-configured project structure
- Ready-to-use authentication system
- File upload functionality out of the box
- Error handling setup

### 2. **Best Practices Built-in**
- MVC architecture for maintainable code
- Environment-based configuration
- Secure password hashing
- JWT token management
- CORS configuration

### 3. **Production Ready**
- Standardized error handling
- Security middlewares included
- Scalable folder structure
- Environment variables for sensitive data

### 4. **Modern JavaScript**
- ES6+ syntax throughout
- Import/export modules
- Async/await pattern
- Arrow functions and modern features

### 5. **Database Integration**
- Mongoose ODM setup
- Schema validation
- Pre-save hooks for password hashing
- Custom methods for token generation

### 6. **File Management**
- Multer for handling multipart data
- Cloudinary integration for cloud storage
- Automatic file cleanup

## 📝 Best Practices

### 1. **Environment Variables**
- Never commit `.env` files
- Use different environments (dev, staging, prod)
- Keep sensitive data in environment variables

### 2. **Error Handling**
- Always use `asyncHandler` for async routes
- Use custom `ApiError` for consistent error responses
- Implement proper HTTP status codes

### 3. **Security**
- Hash passwords before storing
- Use HTTPS in production
- Implement rate limiting
- Validate and sanitize inputs

### 4. **Code Organization**
- Follow MVC pattern strictly
- Keep controllers thin, use services for business logic
- Use meaningful variable and function names
- Add comments for complex logic

### 5. **Database**
- Use indexes for frequently queried fields
- Implement proper schema validation
- Use transactions for related operations
- Regular backups in production

## 🚀 Next Steps

1. **Add your business logic** in controllers
2. **Create additional models** as per your requirements
3. **Implement services** for complex business logic
4. **Add validation middleware** using libraries like Joi
5. **Implement logging** with libraries like Winston
6. **Add rate limiting** for API protection
7. **Write tests** using Jest or Mocha
8. **Set up CI/CD** pipeline for deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 👨‍💻 Author

**Abdul Karim Bukhsh Ansari**
- GitHub: [@AbdulKarimBukhshAnsari](https://github.com/AbdulKarimBukhshAnsari)

---

⭐ Star this repository if you find it helpful!

A simple and clean **Express.js MVC boilerplate** using **ES Modules (import/export)**.  
Helps you start projects with a proper folder structure and scalable architecture.

---
