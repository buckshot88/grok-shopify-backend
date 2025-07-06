const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const XAI_API_KEY = process.env.XAI_API_KEY;

app.post('/api/grok', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/sampler/sample',
      {
        prompt,
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ completion: response.data.completion });
  } catch (error) {
    console.error('xAI API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Grok Shopify Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
