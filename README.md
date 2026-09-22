# 🎵 Mauseeki

**Mauseeki** is a full-stack music streaming application that allows users to discover, listen to, like, and save music while following their favorite artists. The project includes a **React Native mobile application**, **Node.js/Express backend**, **MongoDB database**, and a separate **admin dashboard**.

## 📱 Features

### 👤 User Features

* User registration and login
* Secure authentication
* Profile management
* Profile picture upload
* Browse songs
* Browse artists
* Browse albums
* Search music
* Play and pause songs
* Music player
* Mini player
* Background audio playback
* Like/unlike songs
* Add albums to favourites
* Follow/unfollow artists
* View liked songs
* View favourite albums
* View followed artists
* Recently played songs
* View album songs
* View artist albums

### 🎧 Music Player

* Play/pause controls
* Song information
* Cover artwork
* Mini player
* Background playback
* Music continues while navigating between screens
* Built using **Expo Audio** and React Context

## 🛠️ Admin Features

* Manage users
* Manage artists
* Manage albums
* Manage songs
* View contact messages
* Delete artists
* Delete albums
* Search records

## 🏗️ Project Structure

```text
Mauseeki/
├── frontend/
│   └── mauseeki/
│       ├── screens/
│       ├── components/
│       ├── navigation/
│       ├── MusicPlayerContext/
│       └── ...
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── admin/
    └── React Admin Dashboard
```

## 💻 Technologies Used

### Frontend

* React Native
* Expo
* JavaScript
* React Navigation
* Expo Audio
* AsyncStorage
* Ionicons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* Nodemailer

### Admin Panel

* React.js
* JavaScript
* CSS
* REST APIs

### Cloud Services

* Cloudinary
* MongoDB

## 🗄️ Database Models

### User

* First name
* Last name
* Email
* Password
* Verification code
* Profile picture

### Artist

* Artist name
* Date of birth
* Bio
* Image
* Genres
* Language
* Region
* Creator

### Album

* Album title
* Thumbnail
* Description
* Artist
* Creator

### Song

* Song title
* Artist
* Album
* Genre
* Category
* Language
* Duration
* Cover image
* Audio URL
* Lyrics
* Release year
* Added by

## 🔌 API

Base URL:

```text
http://YOUR_IP:8080/Mauseeki
```

Android Emulator:

```text
http://10.0.2.2:8080/Mauseeki
```

Physical Device:

```text
http://YOUR_LOCAL_IP:8080/Mauseeki
```

### Example Endpoints

```text
GET    /five-artist
GET    /10-rand
GET    /rand-album
GET    /all-songs
GET    /all-artists
GET    /all-album
GET    /play/:id
GET    /artist-alb/:artistId
GET    /album-allsongs/:albumId
GET    /yourlikes
GET    /recents
POST   /Addtofav/:albumId
POST   /add-recent
```

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd Mauseeki
```

## 📱 Frontend Setup

```bash
cd frontend/mauseeki
npm install
```

Create `.env`:

```env
EXPO_PUBLIC_BACKEND_IP=YOUR_LOCAL_IP
```

Example:

```env
EXPO_PUBLIC_BACKEND_IP=192.168.0.108
```

Start Expo:

```bash
npx expo start
```

For Android:

```bash
npx expo start --android
```

## 🖥️ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=8080
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
EMAIL_USER=YOUR_EMAIL
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
```

Start server:

```bash
npm start
```

Development:

```bash
npm run dev
```

## 🌐 Admin Panel

```bash
cd admin
npm install
npm start
```

## 🔐 Environment Variables

Never commit `.env` files to GitHub.

```gitignore
node_modules/
.env
.expo/
dist/
build/
```

## 📂 Main Screens

* Home
* Search
* Songs
* Artists
* Albums
* Player
* Profile
* Update Profile
* Your Songs
* Your Albums
* Your Artists
* Liked Songs
* Favourite Albums
* Followed Artists
* Album Songs
* Artist Albums
* Login
* Signup

## 🎨 UI Design

Mauseeki uses a dark, premium music-streaming interface.

```text
Background: #080808
Cards:      #151515
Primary:    #E50914
Text:       #FFFFFF
Secondary:  #A0A0A0
```

## 🔄 Application Flow

```text
User
 │
 ▼
React Native + Expo
 │
 │ REST API
 ▼
Node.js + Express.js
 │
 ├───────────────┐
 ▼               ▼
MongoDB       Cloudinary
Database      Audio/Images
```

## 🔒 Authentication

```text
User
 │
 ▼
Signup / Login
 │
 ▼
Backend Authentication
 │
 ▼
JWT Token
 │
 ▼
AsyncStorage
 │
 ▼
Authenticated API Requests
```

## ☁️ Cloudinary

Cloudinary is used to store:

* Song audio
* Profile pictures
* Artist images
* Album thumbnails
* Song cover images

MongoDB stores the media URLs instead of the actual media files.

## 📸 Screenshots

Add your screenshots here:

```text
screenshots/
├── home.png
├── search.png
├── player.png
├── profile.png
├── albums.png
├── artists.png
├── liked-songs.png
└── admin-dashboard.png
```

Example:
![Home Screen](screenshots/home.png)
![Music Player](screenshots/player.png)
![Profile](screenshots/profile.png)
Future Improvements
* Playlist creation
* Better music discovery
* Advanced search and filtering
* Artist analytics
* Listening statistics
* Improved audio controls
* Social features
* Offline music support
Project Purpose
Mauseeki was developed as a full-stack application to demonstrate:
* Mobile application development
* REST API development
* Database management
* Authentication
* Cloud media storage
* Audio streaming
* Admin dashboard development
Developer
Sameer
Full-Stack / React Native Developer

### Technologies

```text
React Native
Expo
Node.js
Express.js
MongoDB
Mongoose
Cloudinary
REST APIs
JavaScript
```

## 📄 License

This project is developed for educational and portfolio purposes.

⭐ **Mauseeki — Your Music, Your Mood.** 🎵
