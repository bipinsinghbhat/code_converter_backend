
const express = require('express');
const axios = require('axios')
const cors = require('cors')
require('dotenv').config();

const app = express();
const apiPort = 8080; // Choose a port number that is not in use

app.use(express.json());
app.use(cors())

// OpenAI API credentials
const openaiApiKey = process.env.OPENAI_API_KEY;
// console.log(openaiApiKey)



// API endpoint 
app.post('/api/convert', async (req, res) => {
    try {
      const { code, language } = req.body;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `Translate the following JavaScript code to ${language}:\n${code}`,
        max_tokens: 100,
        temperature: 0.7,
        n: 1
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
  
      const convertedCode = response.data.choices[0].text.trim();
      res.json({ convertedCode });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ error: error });
    }
  });


  app.post('/api/debug', async (req, res) => {
    try {
      const { code } = req.body;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `Tell the errors in the following JavaScript code:\n${code} and provide the corrected code`,
        max_tokens: 100,
        temperature: 0.7,
        n: 1
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
  
      const correctedCode = response.data.choices[0].text.trim();
      res.json({ correctedCode });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ error: error });
    }
  });


  app.post('/api/quality-check', async (req, res) => {
    try {
        const { code } = req.body;
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `Evaluate the quality of the following JavaScript code:\n${code}`,
        max_tokens: 100,
        temperature: 0.7,
        n: 1
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
  
      const evaluation = response.data.choices[0].text.trim();
      res.json({ evaluation });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ error: error });
    }
  });


// Start the server
app.listen(apiPort, () => {
  console.log(`Server is listening on port ${apiPort}`);
});