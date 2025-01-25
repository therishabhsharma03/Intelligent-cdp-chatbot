const axios = require("axios");
const cheerio = require("cheerio");

const getAnswer = async (question) => {
  try {
    const response = await axios.get("https://docs.mparticle.com/");
    const $ = cheerio.load(response.data);

    let answer = "";
    $("h2, h3").each((index, element) => {
      if ($(element).text().toLowerCase().includes("create user")) {
        answer = $(element).next().text(); // Example: grab the next paragraph
      }
    });

    return answer || "Sorry, I couldn't find an answer in mParticle documentation.";
  } catch (error) {
    console.error("Error fetching mParticle documentation:", error);
    return "There was an issue retrieving the data. Please try again later.";
  }
};

module.exports = { getAnswer };
