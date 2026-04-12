# SkinDx — AI Skin Disease Diagnosis System

A full-stack web application for AI-powered skin disease detection using CNN + Transfer Learning.

## Project Structure

```
skin-disease-app/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/db.js
│   ├── middleware/
│   │   ├── verifyToken.js
│   │   └── allowRoles.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── predictController.js
│   │   └── adminController.js
│   └── routes/
│       ├── auth.js
│       ├── predict.js
│       └── admin.js
└── database.sql


```

## Setup Instructions

### 1. MySQL Database

```bash
mysql -u root -p < database.sql
```

This creates the `skin_disease_db` database and tables.


### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Environment Variables (.env)

| Variable     | Description                        | Example              |
|--------------|------------------------------------|----------------------|
| PORT         | Server port                        | 3000                 |
| JWT_SECRET   | Secret key for JWT signing         | change_this_secret   |
| DB_HOST      | MySQL host                         | localhost            |
| DB_USER      | MySQL username                     | root                 |
| DB_PASS      | MySQL password                     | your_password        |
| DB_NAME      | Database name                      | skin_disease_db      |

### 4. Access the App

Open your browser at: **http://localhost:3000**

---

## API Endpoints

| Method | Endpoint              | Auth Required | Role    | Description              |
|--------|-----------------------|---------------|---------|--------------------------|
| POST   | /auth/register        | No            | —       | Register new user        |
| POST   | /auth/login           | No            | —       | Login, get JWT token     |
| POST   | /predict              | Yes           | user    | Upload image, get result |
| GET    | /predict/history      | Yes           | user    | Get own prediction history |
| GET    | /admin/users          | Yes           | admin   | List all users           |
| GET    | /admin/predictions    | Yes           | admin   | List all predictions     |
| GET    | /admin/stats          | Yes           | admin   | Dashboard stats          |
| DELETE | /admin/users/:id      | Yes           | admin   | Delete a user            |

---

## Security Notes

- Admin dashboard is protected at **backend level** using `verifyToken` + `allowRoles('admin')` middleware
- Regular users will receive a `403 Forbidden` response if they try to access admin routes directly
- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 1 day
- File uploads are validated by MIME type and limited to 5MB
