const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, subject, content } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "At least one valid recipient is required" });
    }
    
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return res.status(400).json({ error: "Valid email content is required (min 10 characters)" });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const info = await transporter.sendMail({
      from: `"AI Email Assistant" <${process.env.EMAIL_USER}>`,
      to: recipients.join(', '),
      subject: subject || 'AI Generated Email',
      html: content.replace(/\n/g, '<br>'),
    });

    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      error: "Email sending failed", 
      details: error.message
    });
  }
};