import React, { useState } from 'react';

function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subject, setSubject] = useState('AI Generated Email');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Determine API base URL based on environment
  const API_BASE = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : '';

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setStatus('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setStatus('Generating email...');
    
    try {
      console.log('Sending request to:', `${API_BASE}/api/generate-email`);
      const response = await fetch(`${API_BASE}/api/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      setGeneratedEmail(data.email);
      setStatus('');
    } catch (error) {
      setStatus(`Failed to generate email: ${error.message}`);
      console.error('Error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!recipients.trim()) {
      setStatus('Please enter at least one recipient');
      return;
    }
    
    if (!generatedEmail.trim()) {
      setStatus('Email content is required');
      return;
    }
    
    setIsLoading(true);
    setStatus('Sending email...');
    
    try {
      console.log('Sending request to:', `${API_BASE}/api/send-email`);
      const response = await fetch(`${API_BASE}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipients.split(',').map(r => r.trim()).filter(r => r),
          subject,
          content: generatedEmail
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      setStatus('Email sent successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setRecipients('');
        setPrompt('');
        setGeneratedEmail('');
        setSubject('AI Generated Email');
        setStatus('');
      }, 2000);
    } catch (error) {
      setStatus(`Failed to send email: ${error.message}`);
      console.error('Error details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">AI Email Generator</h1>
        
        {/* Status Message */}
        {status && (
          <div className={`mb-4 p-3 rounded text-center ${
            status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status}
          </div>
        )}
        
        {/* Debug Info */}
        <div className="mb-4 text-sm text-gray-500">
          <p>API Base: {API_BASE || 'Same origin'}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
        </div>
        
        {/* Recipients */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Recipients (comma separated)</label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="user1@example.com, user2@example.com"
            disabled={isLoading}
          />
        </div>
        
        {/* Prompt */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Write a professional email about quarterly sales figures..."
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={generateEmail}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded mb-6 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Email'}
        </button>
        
        {/* Generated Email */}
        {generatedEmail && (
          <div className="mb-6">
            <div className="mb-2">
              <label className="block mb-1 font-medium">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                disabled={isLoading}
              />
            </div>
            
            <label className="block mb-1 font-medium">Email Content</label>
            <textarea
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
              className="w-full p-2 border rounded h-64"
              disabled={isLoading}
            />
            
            <button 
              onClick={sendEmail}
              className={`mt-4 w-full bg-green-600 text-white px-4 py-2 rounded ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;