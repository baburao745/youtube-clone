# YouTube Clone - MERN Stack

A full-stack YouTube Clone built using the MERN stack.

## 🚀 Project Overview

This project is a YouTube-inspired video streaming application developed using:

- MongoDB
- Express.js
- React.js
- Node.js
- JWT Authentication
- Axios
- React Router

The application allows users to register, log in, create channels, upload and manage videos, search videos, filter videos by category, watch videos, like/dislike videos, and manage comments.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Input validation
- Protected routes
- Logout functionality

### 🏠 Home Page

- YouTube-style header
- Search bar
- Toggleable sidebar
- Video grid
- Video thumbnails
- Video titles
- Channel names
- View counts
- Category filters

### 🔎 Search and Filters

Users can search videos by title.

Available categories:

- All
- Music
- Gaming
- Movies
- News
- Sports
- Technology
- Education

### ▶️ Video Player

- Video playback
- Video title
- Description
- Channel information
- View count
- Like button
- Dislike button
- Comments section

### 💬 Comments

Authenticated users can:

- Add comments
- Edit their own comments
- Delete their own comments

Comments are stored in MongoDB.

### 📺 Channels

Authenticated users can:

- Create a channel
- View channel information
- Manage their own videos
- Create videos
- Edit videos
- Delete videos

### 📱 Responsive Design

The application is responsive and supports:

- Desktop
- Tablet
- Mobile devices

---

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- Redux Toolkit
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

---

## 📁 Project Structure

```text
youtube-clone/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── App.jsx
│   └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── public/
├── package.json
└── README.md

⚙️ Installation
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
2. Open the project
cd youtube-clone
3. Install frontend dependencies
npm install
4. Install backend dependencies
cd backend
npm install
🔑 Environment Variables

Create a .env file inside the backend folder.

PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET

Do not upload the .env file to GitHub.

▶️ Run the Application
Start Backend

Open a terminal:

cd backend
npm run dev

The backend runs on:

http://localhost:5000
Start Frontend

Open another terminal:

npm run dev

The frontend will run on the Vite development URL shown in the terminal.

🔗 Main API Routes
Authentication
POST /api/auth/register
POST /api/auth/login
Channels
POST /api/channels
GET /api/channels/:id
GET /api/channels/my-channel
Videos
GET /api/videos
GET /api/videos/:id
POST /api/videos
PUT /api/videos/:id
DELETE /api/videos/:id
POST /api/videos/:id/like
POST /api/videos/:id/dislike
Comments
POST /api/comments
GET /api/comments/:videoId
PUT /api/comments/:id
DELETE /api/comments/:id
🔐 Security

The application uses:

JWT authentication
Password hashing with bcrypt
Protected backend routes
Environment variables for sensitive configuration
Input validation
🗄️ Database

MongoDB is used as the database.

The application contains the following main collections:

Users
Channels
Videos
Comments
🧪 Testing

The backend API was tested using Thunder Client.

Tested functionality includes:

User registration
User login
JWT authentication
Channel creation
Video creation
Video fetching
Video updating
Video deletion
Likes
Dislikes
Adding comments
Editing comments
Deleting comments
📸 Screenshots

Screenshots of the application can be added here for the final project submission.

Recommended screenshots:

Home page
Login page
Register page
Video player
Comments
Create channel
Channel management
Search results
Category filtering
Mobile responsive view
🎥 Demo

A short video demonstration of the project can be added here.

👨‍💻 Author

Developed as a MERN Stack Capstone Project.

📄 License

This project was created for educational purposes.


git repo link("https://github.com/baburao745/youtube-clone.git")
