const axios = require("axios");
const cheerio = require("cheerio");

const getAnswer = async (question) => {
  try {
    const response = await axios.get("https://docs.lytics.com/");
    const $ = cheerio.load(response.data);

    let answer = "";
    $("h2, h3").each((index, element) => {
      if ($(element).text().toLowerCase().includes("audience segment")) {
        answer = $(element).next().text(); // Example: fetch next content
      }
    });

    return answer || "Sorry, I couldn't find an answer in Lytics documentation.";
  } catch (error) {
    console.error("Error fetching Lytics documentation:", error);
    return "There was an issue retrieving the data. Please try again later.";
  }
};

module.exports = { getAnswer };
