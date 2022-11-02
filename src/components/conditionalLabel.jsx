const ConditionalLabel = ({ condition, children }) => {
  if (condition) {
    return children;
  }

  return null;
};

export default ConditionalLabel;
