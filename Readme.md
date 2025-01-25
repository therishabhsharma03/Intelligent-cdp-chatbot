# Intelligent CDP Chatbot

Deployment Link "https://intelligent-cdp-chatbot.vercel.app/"

## Overview
The Intelligent CDP Chatbot is a hybrid question-answering system that provides accurate, concise, and structured responses to queries about Customer Data Platforms (CDPs Zeotap , mParticle, lytics, segment). It leverages both local data (JSON knowledge base) and external APIs (Google Gemini) to deliver responses, ensuring a reliable fallback mechanism and continuous learning.

## Data-Sources
● Segment Documentation: "https://segment.com/docs/?ref=nav"
● mParticle Documentation: "https://docs.mparticle.com/"
● Lytics Documentation: " https://docs.lytics.com/"
● Zeotap Documentation: "https://docs.zeotap.com/home/en-us/"
## Key Features
- **Hybrid Query Resolution**:
  - Local Matching: Finds the best possible answer from a structured JSON dataset scrapped from the above data sources.
  - API Fallback: If the local search fails or is uncertain, the chatbot queries Google Gemini for the answer.

- **Continuous Learning**:
  - The bot can learn new information provided by users and updates its local dataset.

- **User-Friendly Interface**:
  - A responsive chat interface with features like typing indicators and formatted responses.

- **Scalability**:
  - Easily expandable to include new data sources or APIs for enhanced accuracy.

## Architecture
### 1. Frontend
Built with React.js, the frontend provides an intuitive chat interface for user interactions.

Features include:
- Rich text formatting for bot responses
- A typing indicator while the bot fetches answers
- Learning mode for users to teach the bot new answers

### 2. Backend
Powered by Node.js and Express.js, the backend handles:
- Querying the local knowledge base (JSON dataset)
- Fallback to Google Gemini API when local search confidence is low
- Storing newly learned answers in the dataset for future use

Utilizes:
- Natural.js for text similarity analysis (TF-IDF)
- Axios for API requests

### 3. Knowledge Base
The knowledge base is a restructured JSON file containing:
- A list of questions and corresponding answers
- Source URLs for reference

### 4. Fallback Mechanism
If the confidence score for a query is below a threshold, the system queries the Google Gemini API for a concise answer.

## Setup Guide
### Backend Setup
1. Clone the Repository:
```bash
git clone https://github.com/your-repo/intelligent-cdp-chatbot.git
cd intelligent-cdp-chatbot/backend
```

2. Install Dependencies:
```bash
npm install
```

3. Set Up Environment Variables:
Create a `.env` file with:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

4. Run the Backend:
```bash
node index.js
```

### Frontend Setup
1. Navigate to Frontend Directory:
```bash
cd ../frontend
```

2. Install Dependencies:
```bash
npm install
```

3. Start the Frontend:
```bash
npm start
```

## Chatbot Workflow
1. User sends a query
2. Backend searches local JSON dataset
3. If confidence is low, query Google Gemini API
4. Enter learning mode if no answer found
5. Display formatted response

## Future Enhancements
- Multi-Turn Conversations
- Dashboard for Knowledge Base Management
- Analytics
- Additional APIs


