const getInitials = (fullName) => {
  if (fullName === undefined || fullName === null) return;

  const nameParts = fullName.trim().split(/\s+/);

  const initials =
    nameParts.length > 1
      ? nameParts[0][0].toUpperCase() +
        nameParts[nameParts.length - 1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();

  return initials;
};

export default getInitials;
