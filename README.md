AI Email Sender - Full Stack Application
The AI Email Sender is a full-stack application that uses AI to generate professional email content based on user prompts. Users can input recipients, provide a prompt, generate an email with AI, edit the content, and send it directly to recipients.

Features
✨ AI-powered email generation using Groq API

📧 Editable email content before sending

📬 Send emails to multiple recipients

📝 Customizable email subject

🚀 Full-stack application with React frontend and Node.js backend

⚡ Deployed on Vercel with serverless functions

Technologies Used
Frontend
React

Tailwind CSS

Fetch API

Backend
Node.js

Express

Groq SDK (for AI email generation)

Nodemailer (for email sending)

Serverless Functions (Vercel)

Live Demo
View Live Demo (Note: Requires environment variables to be set)

Local Development Setup
Prerequisites
Node.js v16+

npm

Groq API key (free at console.groq.com)

Gmail account (for email sending)

Installation
Clone the repository:

bash
git clone https://github.com/your-username/ai-email-sender.git
cd ai-email-sender
Install dependencies:

bash
npm install
Create .env file in the root directory:

env
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
Start the development server:

bash
npm run dev
Open your browser at:

text
http://localhost:3000
