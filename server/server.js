require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const nodemailer = require('nodemailer');

const app = express();

// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ FATAL ERROR: GROQ_API_KEY is required in environment variables');
  process.exit(1);
}

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 30000, // 30 seconds timeout
  maxRetries: 2,  // Retry failed requests
});

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.send('🚀 AI Email Sender Backend is running!');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    groq: process.env.GROQ_API_KEY ? 'configured' : 'missing',
    email: process.env.EMAIL_USER ? 'configured' : 'missing'
  });
});

// AI Email Generation
app.post('/api/generate-email', async (req, res) => {
  const { prompt } = req.body;
  
  // Input validation
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
    return res.status(400).json({ 
      error: "Valid prompt is required (min 5 characters)",
      received: prompt
    });
  }
  
  try {
    // Try multiple models as fallback
    const models = [
      'llama3-8b-8192',    // Most reliable
      'llama3-70b-8192',   // More powerful
      'mixtral-8x7b-32768' // Alternative
    ];
    
    let emailContent = '';
    let lastError = null;
    
    // Try each model in sequence
    for (const model of models) {
      try {
        console.log(`🤖 Trying model: ${model}`);
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: `You are an email assistant. Generate professional email content based on user input. 
                        Return ONLY the email body text without any subject line or signatures. 
                        Format: Plain text with line breaks.`
            },
            { role: "user", content: prompt }
          ],
          model,
          temperature: 0.7,
          max_tokens: 1024
        });

        if (completion.choices?.[0]?.message?.content) {
          emailContent = completion.choices[0].message.content.trim();
          console.log(`✅ Success with model: ${model}`);
          break;
        }
      } catch (modelError) {
        console.warn(`⚠️ Model ${model} failed: ${modelError.message}`);
        lastError = modelError;
      }
    }
    
    if (!emailContent) {
      throw lastError || new Error("All models failed to generate content");
    }
    
    res.json({ email: emailContent });
  } catch (error) {
    console.error('❌ AI generation error:', error);
    
    let errorDetails = {
      message: error.message,
      type: error.type || 'unknown'
    };
    
    // Add Groq API specific details
    if (error.response) {
      errorDetails.apiStatus = error.response.status;
      errorDetails.apiData = error.response.data;
    }
    
    res.status(500).json({ 
      error: "AI generation failed", 
      details: errorDetails,
      solution: [
        "1. Verify GROQ_API_KEY in .env file",
        "2. Check account status at console.groq.com",
        "3. Try a simpler/shorter prompt",
        "4. Ensure internet connectivity"
      ]
    });
  }
});

// Email Sending (Same as before)
app.post('/api/send-email', async (req, res) => {
  // ... (unchanged from previous version) ...
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n----------------------------------------`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 Groq API Key: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ MISSING'}`);
  console.log(`🔑 Key: ${process.env.GROQ_API_KEY ? '••••' + process.env.GROQ_API_KEY.slice(-4) : 'Not set'}`);
  console.log(`📧 Email User: ${process.env.EMAIL_USER || '❌ Not set'}`);
  console.log(`🌐 CORS Origin: http://localhost:3000`);
  console.log(`----------------------------------------\n`);
  
  // Test Groq connection
  if (process.env.GROQ_API_KEY) {
    console.log('🧪 Testing Groq API connection...');
    groq.chat.completions.create({
      messages: [{ role: "user", content: "Test connection" }],
      model: "llama3-8b-8192",
      max_tokens: 5
    })
    .then(() => console.log('✅ Groq API connection successful'))
    .catch(err => console.error('❌ Groq API test failed:', err.message));
  }
});