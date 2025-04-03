const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple authentication (basic example - improve this in production)
const API_KEY = process.env.API_KEY;

// Middleware to check API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  console.log('Received API key:', apiKey);
  console.log('Expected API key:', API_KEY);
  console.log('Headers:', req.headers);
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Routes
app.get('/api/status', (req, res) => {
  res.json({ message: 'ShutOff Server is running' });
});

app.post('/shutdown', authenticateApiKey, (req, res) => {
  res.json({ message: 'Shutdown command received. Shutting down in 5 seconds...' });
  console.log('Shutdown command received');
  
  // Windows shutdown command with 5 second delay
  setTimeout(() => {
    exec('shutdown /s /t 1', (error) => {
      if (error) {
        console.error(`Shutdown error: ${error}`);
      }
    });
  }, 5000);
});

app.post('/restart', authenticateApiKey, (req, res) => {
  res.json({ message: 'Restart command received. Restarting in 5 seconds...' });
  console.log('Restart command received');
  
  // Windows restart command with 5 second delay
  setTimeout(() => {
    exec('shutdown /r /t 1', (error) => {
      if (error) {
        console.error(`Restart error: ${error}`);
      }
    });
  }, 5000);
});

app.post('/cancel', authenticateApiKey, (req, res) => {
  exec('shutdown /a', (error, stdout, stderr) => {
    if (error) {
      console.error(`Cancel error: ${error}`);
      return res.status(500).json({ message: 'Failed to cancel shutdown/restart' });
    }
    res.json({ message: 'Shutdown/restart cancelled successfully' });
  });
});

// Helper endpoint for testing (less secure but easier to test)
app.get('/test-shutdown', (req, res) => {
  const apiKey = req.query.key;
  
  console.log('Test endpoint called with key:', apiKey);
  console.log('Expected key:', API_KEY);
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  res.json({ message: 'API key valid! This would shutdown the computer if not in test mode.' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`ShutOff Server running on http://0.0.0.0:${port}`);
  console.log(`ShutOff Server running on port ${port}`);
  console.log('Available commands:');
  console.log('- POST /shutdown: Shutdown the computer');
  console.log('- POST /restart: Restart the computer');
  console.log('- POST /cancel: Cancel pending shutdown/restart');
}); 