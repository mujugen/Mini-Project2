const { response } = require("express");

async function redFlagRemover(rawText, openai, filters, name) {
  console.log("running red flag remover");
  text = rawText;
  prompt =
    '\n\nAnswer these questions below in yes or no only in this format "NUMBER:YES/NO", and add this character after the answer "<br>"\n';
  for (const filter of filters) {
    if (filter == 1) {
      prompt += "1.Did you notice bad formatting?\n";
    }
    if (filter == 2) {
      prompt += "2.Do you think they lack achievements?\n";
    }
    if (filter == 3) {
      prompt += "3.Do they have unexplained gaps in employment?\n";
    }
    if (filter == 4) {
      prompt += "4.Do you think they were job hopping?\n";
    }
    if (filter == 5) {
      prompt +=
        "5.Do you think it was written by someone who doesn't know how to spell?\n";
    }
    if (filter == 6) {
      prompt += "6.Did they use swear words?\n";
    }
    if (filter == 7) {
      prompt += "7.Do you think their career had been stagnant for a while?\n";
    }
    if (filter == 8) {
      prompt += "8.Were they changing careers too often?\n";
    }
  }
  prompt += text;
  /* console.log(prompt); */

  console.log("Aking prompt in redFlagRemover\n");
  let response = await askPrompt(prompt, openai);
  response = response.trim();
  redFlags = featureRetrieval(response);
  console.log(redFlags);
  return redFlags;
}

function featureRetrieval(text) {
  text = text.trim();
  let lines = text.split("<br>");
  lines = lines.map((element) => element.replace(/\n/g, ""));
  console.log(lines);
  let redFlags = {
    red_flag_1: 0,
    red_flag_2: 0,
    red_flag_3: 0,
    red_flag_4: 0,
    red_flag_5: 0,
    red_flag_6: 0,
    red_flag_7: 0,
    red_flag_8: 0,
  };
  for (i = 0; i < 8; i++) {
    console.log(`Line ${i + 1} == ${lines[i]}`);
    if (lines[i].toUpperCase() == `${i + 1}:YES`) {
      // Fix the comparison here
      redFlags[`red_flag_${i + 1}`] = 1; // Update the redFlags key here
    }
  }
  return redFlags;
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
