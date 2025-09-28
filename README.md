# 🔗DevConnect

DevConnect is a full-stack MERN platform designed to help developers discover, connect, and collaborate in real-time. It provides a seamless experience for finding peers, managing professional connections, and engaging in meaningful conversations.

🌐 **Live Project:** [https://devconnect.services/](https://devconnect.services/)

---

<div align="center">
  <img src="https://raw.githubusercontent.com/kratin01/DevConnect/refs/heads/main/public/ss2.png" alt="Screenshot 1" width="300" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/kratin01/DevConnect/refs/heads/main/public/ss3.png" alt="Screenshot 2" width="300" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/kratin01/DevConnect/refs/heads/main/public/ss4.png" alt="Screenshot 3" width="250" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/kratin01/DevConnect/refs/heads/main/public/ss5.png" alt="Screenshot 4" width="250" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/kratin01/DevConnect/refs/heads/main/public/ss6.png" alt="Screenshot 5" width="250" style="margin: 5px;" />

## </div>

## 🚀 Features

- **Secure Authentication**: JWT-based authentication (Login / Signup) with password hashing (bcrypt).
- **User Profile Management**: Create and update a detailed developer profile
- **Connection Management**: Send, receive, and manage connection requests.
- **Email Notifications**: Get instant email notifications when a connection request is accepted, powered by Amazon SES.
- **Daily Reminders**: A daily cron job sends an email at 8 AM with a summary of pending connection requests from the previous day.
- **Real-time Chat**: Engage in one-on-one real-time conversations with your connections using Socket.io.
- **RESTful API**: A clean, well-structured, and modular API.
- **Production Ready**: Deployed on AWS EC2, with the frontend served by Nginx and the backend managed by PM2 for high availability.

---

## 🛠️ Tech Stack & Architecture

This project is built using a microservice architecture with a separate frontend and backend.

### **Backend (Node.js / Express)**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.io
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Scheduled Jobs**: `node-cron`
- **Email Service**: **Amazon SES** (Simple Email Service) via Nodemailer
- **Process Manager**: PM2

### **Frontend (React / Vite)**

- **Framework**: React.js
- **Build Tool**: Vite
- **State Management**: **Redux Toolkit**
- **Styling**: Tailwind CSS
- **Component Library**: **DaisyUI**
- **Routing**: React Router
- **API Communication**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### **Deployment**

- **Cloud Provider**: Amazon Web Services (AWS) EC2
- **Web Server**: Nginx (for serving the frontend)
- **Process Manager**: PM2 (for managing the Node.js backend)

---

## ⚙️ Local Setup Instructions

To run this project locally, you will need to set up both the backend and frontend services.  
Check out the [**Frontend Repository**](https://github.com/kratin01/DevConnect) to set up the frontend.

### 1. Clone the repository

```bash
git clone https://github.com/kratin01/DevConnect-Backend
```

### 2. Navigate to the project directory

```bash
cd DevConnect-Backend
npm install
```

### 3. Create a .env file in the root directory

```bash
PORT=8000
CORS_ORIGIN=http://localhost:5173

# MongoDB Connection String
MONGO_DB_URI="your_mongodb_connection_string"

# JSON Web Token Secret
JWT_SECRET="your_super_strong_jwt_secret"

# AWS Simple Email Service (SES) Credentials
AWS_SES_ACCESS_KEY="your_aws_ses_access_key"
AWS_SES_SECRET="your_aws_ses_secret_key"
AWS_REGION="your_aws_region" # e.g., us-east-1
SENDER_EMAIL_ADDRESS="your_verified_ses_sender_email"
```

### 4. Run the development server

```bash
npm run server
```

### 🔐 Security

- Password hashing using bcrypt
- JWT-based authentication
- CORS protection
- Input validation
- Rate limiting
- Environment variable protection

## 📜 License

This project is open-source and available under the **MIT License**.
