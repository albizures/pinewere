const getElementIndex = (element: Element) => {
	const {
		parentElement: { children },
	} = element;

	for (let index = 0; index < children.length; index++) {
		const currentElement = children[index];
		if (currentElement === element) {
			return index + 1;
		}
	}
};

const getElementPath = (element: Element): string => {
	if (element.id) {
		return element.id;
	}

	if (element === document.body) {
		return 'body';
	}

	const { parentElement: parent } = element;
	const index = getElementIndex(element);
	const parentPath = getElementPath(parent);
	const typeElement = element.tagName.toLowerCase();

	return `${parentPath} > ${typeElement}:nth-child(${index})`;
};
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
		left,
		text: anchorNode.textContent.substring(anchorOffset, focusOffset),
		elementPath: getElementPath(anchorNode.parentElement),
	};
};

export { getSelection };
