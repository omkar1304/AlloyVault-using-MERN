const filterOption = (input, option) =>
  ((option && option?.label) || "")
    ?.toLowerCase()
    ?.includes(input?.toLowerCase());

export default filterOption;
