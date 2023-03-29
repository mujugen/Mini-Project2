async function redFlagRemover(rawText, openai, filters) {
  console.log("running red flag remover");
  text = rawText;
  prompt = text;
  /* console.log(prompt); */
  prompt += "FUCK SHIT BULLSHIT MOTHERFUCKER ASDHJFUIASHNJDA";
  prompt +=
    '\n\nAnswer these questions below in yes or no only in this format "QUESTION: ANSWER" and add this character before and after the answer "<br>"\n';
  for (const filter of filters) {
    if (filter == 1) {
      prompt += "Did you notice bad formatting?\n";
    }
    if (filter == 2) {
      prompt += "Do you think they lack achievements?\n";
    }
    if (filter == 3) {
      prompt += "Do they have unexplained gaps in employment?\n";
    }
    if (filter == 4) {
      prompt += "Do you think they were job hopping?\n";
    }
    if (filter == 5) {
      prompt +=
        "Were there excessive grammar, spelling, and punctuation mistakes?\n";
    }
    if (filter == 6) {
      prompt += "Did they use swear words?\n";
    }
    if (filter == 7) {
      prompt += "Do you think their career had been stagnant for a while?\n";
    }
    if (filter == 8) {
      prompt += "Were they changing careers too often?\n";
    }
  }
  console.log("Aking prompt in redFlagRemover");
  const response = await askPrompt(prompt, openai);
  return response;
}

// Function that takes the text prompt and puts it into OpenAI API
// Returns text response
async function askPrompt(prompt, openai) {
  const model_engine = "text-davinci-003";

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

module.exports = {
  redFlagRemover,
};
