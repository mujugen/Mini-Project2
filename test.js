/* Function to create reproducable cells */
function addSkillFormGroup(skill) {
    container_id = "skillFilterForm";
    const container = document.getElementById(container_id);
    /* Create elements */
    const form_check = document.createElement("div");
    form_check.className = "cell-text-title";
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.value = "0";
    input.onchange = "getSelectedSkillFilters()";
    const label = document.createElement("label");
    label.className = "form-check-label";
    label.textContent = skill;
    /* Append all created elements */
    container.append(form_check);
    form_check.append(input,label);
  }