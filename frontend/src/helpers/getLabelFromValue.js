const getLabelFromValue = (optionValue, optionsList = []) => {
  const found = optionsList?.find((option) => option.value === optionValue);
  return found ? found.label : "";
};

export default getLabelFromValue;
