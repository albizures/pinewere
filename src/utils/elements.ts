type Child = Element | string;
type Styles = Partial<CSSStyleDeclaration>;

interface Args {
	children?: Child[];
	className?: string;
}

const createElement = (type: string, args: Args) => {
	const { children = [], className } = args;
	const element = document.createElement(type);

	children.forEach((child) => {
		if (typeof child === 'string') {
			element.appendChild(document.createTextNode(child));
		} else {
			element.appendChild(child);
		}
	});

	element.classList.add(className);

	return element;
};

const setStyles = (element: HTMLElement, styles: Styles) => {
	Object.assign(element.style, styles);
	return element;
};

const px = (value: number) => `${value}px`;

export { createElement, setStyles, px };
