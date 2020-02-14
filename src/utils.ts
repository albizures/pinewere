const getSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    return null;
  }

  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;

  if (!anchorNode || !focusNode) {
    // maybe inside of a iframe
    return null;
  }

  // multiparagraph selection
  if (anchorNode !== focusNode) {
    return null;
  }

  const { width, height, x, y, top, left } = selection
    .getRangeAt(0)
    .getBoundingClientRect();

  return {
    width,
    height,
    x,
    y,
    top,
    left
  };
};

export { getSelection };
