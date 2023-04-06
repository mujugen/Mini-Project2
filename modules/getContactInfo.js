async function getContactInfo(orgArray) {
  prompt = `Help me find the contact information of these organizations,\n`;
  for (let i = 0; i < orgArray.length; i++) {
    prompt += `Organization ${i + 1}:`;
    prompt += orgArray[i];
    prompt += `\n`;
  }
  console.log(prompt);
  return prompt;
}

module.exports = {
  getContactInfo,
};
