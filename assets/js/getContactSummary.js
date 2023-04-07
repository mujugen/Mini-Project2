async function getContactSummary(prompt, openai) {
  const response = await askPrompt(prompt, openai);
  console.log("Contact summary finished");
  return response;
}

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

module.exports = {
  getContactSummary,
};
