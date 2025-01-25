const segmentService = require("../services/segmentService");
const mParticleService = require("../services/mParticleService");
const lyticsService = require("../services/lyticsService");
const zeotapService = require("../services/zeotapService");
const natural = require("natural");

const extractKeywords = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());
  return words.filter((word) =>
    ["setup", "create", "build", "integrate", "segment", "mparticle", "lytics", "zeotap"].includes(word)
  );
};

const handleQuery = async (req, res) => {
  const { question } = req.body;

  try {
    const keywords = extractKeywords(question);
    let answer = "";

    if (keywords.includes("segment")) {
      answer = await segmentService.getAnswer(question);
    } else if (keywords.includes("mparticle")) {
      answer = await mParticleService.getAnswer(question);
    } else if (keywords.includes("lytics")) {
      answer = await lyticsService.getAnswer(question);
    } else if (keywords.includes("zeotap")) {
      answer = await zeotapService.getAnswer(question);
    } else {
      answer = "Could you clarify which platform you're referring to?";
    }

    res.json({ answer });
  } catch (error) {
    console.error("Error handling query:", error);
    res.status(500).json({ answer: "An error occurred while processing your request." });
  }
};

module.exports = { handleQuery };
