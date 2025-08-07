# ✉️ AI Email Sender – Full Stack Application

The **AI Email Sender** is a full-stack web application that uses AI to generate professional email content based on user prompts. Users can input recipient details, generate emails with AI, edit them as needed, and send them directly from the app.

---

## 🚀 Features

- ✨ **AI-powered email generation** using **Groq API**
- 📝 **Editable** email content before sending
- 📬 Send emails to **multiple recipients**
- 🖊️ **Customizable subject lines**
- 💻 Full-stack app with **React frontend** and **Node.js backend**
- ⚡ Deployed on **Vercel** with **serverless functions**

---

## 🧰 Technologies Used

### Frontend
- React
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express
- Groq SDK (for AI email generation)
- Nodemailer (for sending emails)
- Vercel Serverless Functions

---

## 🔗 Live Demo

👉 [View Live Demo](https://ai-email-sender-gi9typp4c-krishna-verma-s-projects.vercel.app/)  

## Setup Instructions

### 1. Clone the Repository

``bash
git clone https://github.com/yourusername/ai-email-sender.git
cd ai-email-sender
``
### 2. Install Dependencies

Frontend
``cd client
npm install
``
Backend
``cd ../server
  npm install
``

### 3. Configure Environment Variables
Frontend (.env)
Create a .env file in the client directory:
``VITE_API_BASE_URL=http://localhost:5000
``

Backend (.env)
Create a .env file in the server directory:
``PORT=5000
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_SERVICE=gmail 
``
### 4. Run the Application
Start Backend Server
``cd server
  npm start
``

Start Frontend Development Server
``cd ../client
  npm run dev
  ``
The application should now be running:

Frontend: http://localhost:5173

Backend: http://localhost:5000  
