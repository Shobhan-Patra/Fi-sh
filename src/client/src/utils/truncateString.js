const truncateString = (givenString, maxLength = 40) => {
  if (!givenString) return '';
  const trimmedString = givenString.trim();

  if (trimmedString.length <= maxLength) {
    return trimmedString;
  }

  return trimmedString.slice(0, maxLength) + '...';
};

export default truncateString;
