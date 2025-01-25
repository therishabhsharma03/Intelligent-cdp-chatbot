const axios = require("axios");
const cheerio = require("cheerio");

const getAnswer = async (question) => {
  try {
    const response = await axios.get("https://docs.zeotap.com/home/en-us/");
    const $ = cheerio.load(response.data);

    let answer = "";
    $("h2, h3").each((index, element) => {
      if ($(element).text().toLowerCase().includes("integrate data")) {
        answer = $(element).next().text(); // Example: fetch next content
      }
    });

    return answer || "Sorry, I couldn't find an answer in Zeotap documentation.";
  } catch (error) {
    console.error("Error fetching Zeotap documentation:", error);
    return "There was an issue retrieving the data. Please try again later.";
  }
};

module.exports = { getAnswer };
