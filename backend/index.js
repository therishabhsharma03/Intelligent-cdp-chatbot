const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

require('dotenv').config(); // Load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

let docsData = []; // To hold the restructured data

app.get('/status', (req, res) => {
  console.log("./status-hit")
  res.json({ status: 'ready' });
});

// Load and process dataset
const loadDocsData = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'restructured_docs_data.json'), 'utf8');
    docsData = JSON.parse(data);

    if (!Array.isArray(docsData)) {
      throw new Error('Dataset must be an array of entries.');
    }

    docsData = docsData.filter((entry) => {
      if (!entry.questions || !Array.isArray(entry.questions)) {
        console.warn(`Invalid entry skipped: ${JSON.stringify(entry)}`);
        return false;
      }
      return true;
    });

    console.log(`DocsData Loaded: ${docsData.length} valid entries.`);
  } catch (err) {
    console.error('Error loading dataset:', err.message);
    process.exit(1); // Exit if the dataset can't be loaded
  }
};


// Search locally for an answer
const findLocalAnswer = (query) => {
  const normalizedQuery = query.toLowerCase().trim();

  for (const entry of docsData) {
    const questions = entry.questions.map((q) => q.toLowerCase().trim());
    if (questions.includes(normalizedQuery)) {
      return {
        question: normalizedQuery,
        answer: entry.answers[0] || 'No answer available.',
        source: entry.url || 'Unknown source',
      };
    }
  }

  return null; // Return null if no match is found
};

// Query Google Generative AI (Gemini) directly
const queryGeminiAI = async (query) => {
  try {
    const modifiedQuery = `${query} Please provide the answer in a very short and concise manner. (If the question asked is not relevent to CDP Platform like - Zeotap , mParticle , Segment or lytics then respond with this question is irrelevent !!)`;

    console.log(`Querying Gemini for: "${modifiedQuery}"`);

    const requestBody = {
      contents: [
        {
          parts: [
            { text: modifiedQuery },
          ],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = response.data;
    console.log('Gemini API Response:', JSON.stringify(responseData, null, 2));

    if (
      responseData &&
      responseData.candidates &&
      responseData.candidates.length > 0 &&
      responseData.candidates[0].content &&
      responseData.candidates[0].content.parts &&
      responseData.candidates[0].content.parts.length > 0
    ) {
      return responseData.candidates[0].content.parts[0].text;
    }

    throw new Error("No valid content found");
  } catch (error) {
    console.error('Error querying', error.message);
    return "Sorry, I couldn't retrieve an answer.";
  }
};

// Routes
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'A question is required.' });
  }

  console.log(`Received question: "${question}"`);

  // Try to find the answer locally
  const localAnswer = findLocalAnswer(question);
  if (localAnswer) {
    return res.json(localAnswer);
  }

  // Fallback to Gemini
  console.log('Fallback to Gemini API...');
  const geminiAnswer = await queryGeminiAI(question);

  res.json({
    question,
    answer: geminiAnswer,
    source: 'Gemini API',
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, async () => {
  await loadDocsData();
  console.log(`Server running on port ${PORT}`);
});
