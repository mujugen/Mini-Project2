function hasSelectedLanguages(globalUserArray, filters) {
  for (let i = 0; i < filters.length; i++) {
    for (let j = 0; j < 5; j++) {
      const skillKey = `programmingLanguage${j}`;
      if (!globalUserArray[i][skillKey].includes(filters[i])) {
        return false;
      }
    }
  }
  return true;
}

const skillKey = `programmingLanguage${i}`;
if (skillKey in user) {
  availableSkills.add(user[skillKey]);
}
