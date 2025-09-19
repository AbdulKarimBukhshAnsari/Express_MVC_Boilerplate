# Express MVC Boilerplate

A simple and clean **Express.js MVC boilerplate** using **ES Modules (import/export)**.  
Helps you start projects with a proper folder structure and scalable architecture.

---

## 📂 Project Structure

```
src/
├── config/          # Configuration files (database, environment variables)
├── controllers/     # Request handlers and business logic
├── middlewares/     # Custom middleware functions
├── models/          # Database models and data layer
├── routes/          # API route definitions
├── utils/           # Utility functions and helpers
├── app.js           # Express application setup
└── server.js        # Server entry point
```

---

## ⚡ Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/AbdulKarimBukhshAnsari/Express_MVC_Boilerplate.git
cd express-mvc-boilerplate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create a .env file in the root directory
PORT=5000
# Add other environment variables as needed
```

4. **Run in development mode**
```bash
npm run dev
```

5. **Run in production mode**
```bash
npm start
```

---

## 🧩 Code Example

**Route definition (src/routes/userRoutes.js):**
```javascript
import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = Router();
router.get("/", getAllUsers);

export default router;
```

**Controller (src/controllers/userController.js):**
```javascript
export const getAllUsers = (req, res) => {
  res.json({ message: "All users" });
};
```

---

## 📦 Scripts

- `npm run dev` - Runs the application with hot-reload using nodemon

---

## 🔧 Features

- MVC architecture pattern
- ES Modules support
- Environment configuration
- Modular route handling
- Ready for database integration
- Scalable folder structure

