const truncateString = (givenString) => {
  if (!givenString) return '';
  const maxLength = 40;
  const trimmedString = givenString.trim();

  if (trimmedString.length <= maxLength) {
    return trimmedString;
  }

  return trimmedString.slice(0, maxLength) + '...';
};

export default truncateString;
