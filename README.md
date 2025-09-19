# Express MVC Boilerplate

A simple and clean **Express.js MVC boilerplate** using **ES Modules (import/export)**.  
Helps you start projects with a proper folder structure and scalable architecture.

---

## 📂 Structure

src/
├── config/ # Config files
├── controllers/ # Business logic
├── middlewares/ # Middlewares
├── models/ # Database models
├── routes/ # API routes
├── utils/ # Helpers
└── app.js # Express app
server.js # Entry point



---

## ⚡ Setup

```bash
git clone https://github.com/your-username/express-mvc-boilerplate.git
cd express-mvc-boilerplate
npm install
Add .env file:

env
Copy code
PORT=5000
Run in dev mode:

bash
Copy code
npm run dev
Run in prod mode:

bash
Copy code
npm start
🧩 Example

// src/routes/userRoutes.js
import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = Router();
router.get("/", getAllUsers);
export default router;

// src/controllers/userController.js
export const getAllUsers = (req, res) => {
  res.json({ message: "All users" });
};
