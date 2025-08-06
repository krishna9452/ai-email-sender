const { Groq } = require('groq-sdk');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return res.status(400).json({ 
        error: "Valid prompt is required (min 5 characters)",
      });
    }
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 30000
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an email assistant. Generate professional email content based on user input. Return only the email body text." 
        },
        { role: "user", content: prompt }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from Groq API");
    }
    
    const emailContent = completion.choices[0].message.content;
    return res.status(200).json({ email: emailContent });
  } catch (error) {
    console.error('AI generation error:', error);
    return res.status(500).json({ 
      error: "AI generation failed", 
      details: error.message
    });
  }
};