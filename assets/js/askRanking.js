// Main function that will ask a prompt to openAI API, retrieve a response, and extract the features
// Creates and returns an Applicant class with the found features
async function askRank(text, openai) {
  const prompt = text;
  console.log(`askRank in action with prompt ${text}`);
  const response = await askPrompt(prompt, openai);
  console.log(`response received ${response}`);
  return response;
}
// End of CVSummarize()

// Function that takes the text prompt and puts it into OpenAI API
// Returns text response
async function askPrompt(prompt, openai) {
  const model_engine = "text-davinci-003";
  /* const model_engine = "gpt-3.5-turbo"; */

  console.log("Waiting for response");
  const response = await openai.createCompletion({
    model: model_engine,
    prompt: prompt,
    temperature: 0,
    max_tokens: 2000,
    n: 1,
    top_p: 1.0,
  });
  console.log("Response received\n");
  return response.data.choices[0].text;
}
// End of askPrompt function

// Function that takes any text and returns lines that match the match text
// Returned matched text if found, and null if not
function featureRetrieval(match_text, text) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.includes(match_text)) {
      let line_without_match = line.replace(match_text, "");
      if (line_without_match == "") {
        line_without_match = "N/A";
      }
      return line_without_match.trim();
    }
  }
  return "N/A";
}

module.exports = {
  askRank,
};
