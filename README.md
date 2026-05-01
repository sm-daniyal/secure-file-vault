# ⬡ Secure File Vault

A full-stack web application for securely uploading, managing, and downloading personal files — built as a college-level project demonstrating core full-stack concepts.

---

## Tech Stack

| Layer        | Technology              |
|-------------|-------------------------|
| Frontend     | React 18 + Vite         |
| Backend      | Node.js + Express       |
| Database     | MongoDB + Mongoose      |
| Auth         | JWT + bcrypt            |
| File Upload  | Multer                  |
| HTTP Client  | Axios                   |

---

## Project Structure

```
secure-file-vault/
│
├── client/                        # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx               # App entry point
│       ├── App.jsx                # Routes + protected route guards
│       ├── index.css              # Global styles + design tokens
│       ├── api.js                 # Axios instance with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state (user, token, login, logout)
│       ├── pages/
│       │   ├── AuthPage.jsx       # Login / Register page
│       │   ├── AuthPage.css
│       │   ├── Dashboard.jsx      # Main file management page
│       │   └── Dashboard.css
│       └── components/
│           ├── Navbar.jsx         # Top navigation bar
│           ├── Navbar.css
│           ├── UploadZone.jsx     # Drag-and-drop file uploader
│           ├── UploadZone.css
│           ├── FileCard.jsx       # Single file display card
│           └── FileCard.css
│
└── server/                        # Express backend
    ├── index.js                   # App entry — DB connect + server start
    ├── package.json
    ├── .env.example               # Environment variable template
    ├── .gitignore
    ├── uploads/                   # Files stored here on disk
    ├── models/
    │   ├── User.js                # Mongoose user schema (bcrypt hashing)
    │   └── File.js                # Mongoose file metadata schema
    ├── middleware/
    │   └── auth.js                # JWT verification middleware
    ├── controllers/
    │   ├── authController.js      # register + login logic
    │   └── fileController.js      # upload / list / download / delete
    └── routes/
        ├── auth.js                # POST /api/auth/register, /api/auth/login
        └── files.js               # GET/POST/DELETE /api/files (+ multer config)
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongod`) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **npm** (comes with Node)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd secure-file-vault
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
MONGO_URI=mongodb://localhost:27017/secure-file-vault
JWT_SECRET=replace_this_with_a_long_random_secret_string
PORT=5000
MAX_FILE_SIZE=10485760
```

> 💡 **Tip:** For `JWT_SECRET`, use something like: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Start the backend (development mode with auto-reload):

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

You should see:
```
  VITE ready in Xms
  ➜  Local: http://localhost:5173/
```

### 4. Open the App

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

1. Click **Register** to create an account
2. Log in — you'll land on the **Dashboard**
3. Upload, download, and delete files!

---

## API Reference

### Auth Endpoints

| Method | Endpoint              | Body                              | Description        |
|--------|-----------------------|-----------------------------------|--------------------|
| POST   | `/api/auth/register`  | `{username, email, password}`     | Create an account  |
| POST   | `/api/auth/login`     | `{email, password}`               | Get a JWT token    |

### File Endpoints (all require `Authorization: Bearer <token>`)

| Method | Endpoint                    | Description                        |
|--------|-----------------------------|------------------------------------|
| GET    | `/api/files`                | List all files for logged-in user  |
| GET    | `/api/files?search=text`    | Search files by name               |
| POST   | `/api/files/upload`         | Upload a file (multipart/form-data)|
| GET    | `/api/files/download/:id`   | Download a specific file           |
| DELETE | `/api/files/:id`            | Delete a specific file             |

---

## Core Concepts Demonstrated

| Concept                  | Where                                     |
|--------------------------|-------------------------------------------|
| Password hashing         | `models/User.js` — bcrypt pre-save hook   |
| JWT generation           | `controllers/authController.js`           |
| Protected routes         | `middleware/auth.js` + React route guards |
| File upload (multer)     | `routes/files.js`                         |
| File type whitelisting   | `routes/files.js` — `fileFilter`          |
| Per-user data isolation  | All file queries include `owner` filter   |
| React Context            | `context/AuthContext.jsx`                 |
| Axios interceptors       | `src/api.js` — auto-attach token          |
| Drag-and-drop upload     | `components/UploadZone.jsx`               |

---

## Security Notes

- Passwords are **never stored in plain text** — only bcrypt hashes
- JWT tokens expire after **7 days**
- Every file query is **filtered by owner** — users can't access each other's files
- File types are **whitelisted** (not blacklisted) — safer approach
- File size is **limited to 10MB** by default (configurable via `.env`)
- Routes are protected server-side — the frontend guards are UX only

---

## Possible Enhancements

- [ ] File preview (images, PDFs) in the browser
- [ ] Folder / tag organization
- [ ] Share a file via a one-time link
- [ ] Store files on AWS S3 or Cloudinary instead of disk
- [ ] Refresh token system (currently JWT is stateless)
- [ ] Admin panel to manage all users

---

## License

MIT — free to use for learning and personal projects.
