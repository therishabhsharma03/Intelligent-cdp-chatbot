const axios = require("axios");
const cheerio = require("cheerio");

const getAnswer = async (question) => {
  // Here we would search the Segment documentation for the question
  const response = await axios.get("https://segment.com/docs/");
  const $ = cheerio.load(response.data);
  let answer = "";
  // Basic search: look for "source" as an example
  $('h2').each((index, element) => {
    if ($(element).text().toLowerCase().includes("source")) {
      answer = $(element).next().text();  // Grab next section text
    }
  });
  return answer || "Sorry, I couldn't find an answer to that question.";
};

module.exports = { getAnswer };
