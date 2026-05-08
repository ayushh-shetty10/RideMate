# RideMate - Campus Shared Travel Platform

RideMate is a premium, secure, and exclusive ride-sharing platform designed specifically for college communities. It helps students connect with verified peers to share journeys, save money, and reduce their carbon footprint.

## 🚀 Key Features

- **Google OAuth with College Restriction**: Exclusive access for verified students using specific campus domains.
- **Dynamic Ride Discovery**: Real-time marquee showcasing available rides and advanced filtering with time-window matching.
- **Ride Management**: Effortlessly host a ride or join existing ones with instant capacity updates.
- **Automated Notifications**: Real-time email alerts via Nodemailer for joining, leaving, or cancelling rides.
- **Admin Security Suite**: Comprehensive dashboard for user management, safety reports, and automated admin alerts.
- **Secure Authentication**: Backend JWT token blacklisting on logout for production-grade security.
- **Premium Responsive UI**: Modern glassmorphism aesthetic built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT, Google OAuth 2.0.
- **Communication**: Nodemailer (OAuth2 with Gmail).

## 💻 Local Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB
- Google Cloud Console project (for OAuth)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on the structure below:
```env
PORT=3000
MONGO_URL=your_mongodb_url
JWT_SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail
REFRESH_TOKEN=your_gmail_refresh_token
ALLOWED_EMAILS=comma_separated_test_emails
ADMIN_EMAILS=comma_separated_admin_emails
```
4. Start the server: `npm start` (or `node server.js`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on the structure below:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:3000
```
4. Run the development server: `npm run dev`

## 🌍 Deployment

- **Frontend**:  **Vercel**.
- **Backend**: **Render**.
- **Database**: **MongoDB** 


## 📸 Screenshots
*(Placeholders for future screenshots)*
- [Landing Page]
- [Ride Discovery]
- [Admin Dashboard]

---
Made with ❤️ for the college community.
