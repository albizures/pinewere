import { css, glob } from 'goober';
import { createElement, setStyles, px } from './utils/elements';
import { getSelection } from './utils';

let currentSelection: ReturnType<typeof getSelection>;

const color = '#FAE704';
glob`
	@keyframes flash {
		0% {
			background: ${color};
		}
		80% {
			background: transparent
		}
	}
`;

const highlightedText = css`
	background-color: transparent;
	animation: 2s flash 1;
	border: 1px dashed gray;
`;

enum QueryParams {
	PATH = 'pinewere_path',
	START = 'pinewere_start',
	END = 'pinewere_end',
}

const caretSize = 8;

const backdrop = createElement('div', {
	className: css`
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`,
});

const saveButton = createElement('button', {
	children: ['🖊️ Highlight'],
	className: css`
		background: transparent;
		border: 0;
		font-size: 1rem;

		&::after {
			content: '';
			position: absolute;
			top: 100%;
			left: 50%;
			border: ${caretSize}px solid transparent;
			border-top-color: ${color};
		}
	`,
});

const menu = createElement('div', {
	children: [saveButton],
	className: css`
		background: ${color};
		padding: 4px 8px;
		position: absolute;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
	`,
});

const showMenu = () => {
	setStyles(backdrop, {
		display: 'block',
	});
	setStyles(menu, {
		display: 'block',
	});
};

const hideMenu = () => {
	setStyles(backdrop, {
		display: 'none',
	});
	setStyles(menu, {
		display: 'none',
	});
};

const updateMenuPosition = (top: number, left: number) => {
	setStyles(menu, {
		top: px(top),
		left: px(left),
	});
};

hideMenu();

const onMouseUp = () => {
	const selection = getSelection();

	if (!selection) {
		return;
	}

	currentSelection = selection;

	const { top, left, width } = selection;

	showMenu();

	const { clientHeight: menuHeight, clientWidth: menuWidth } = menu;

	updateMenuPosition(
		top + window.scrollY - caretSize - menuHeight,
		left + window.scrollX + width / 2 - menuWidth / 2,
	);
};

const onBackdropClick = () => {
	hideMenu();
};

const onSave = (event: MouseEvent) => {
	hideMenu();

	event.stopPropagation();

	if (window.getSelection().empty) {
		window.getSelection().empty();
	} else if (window.getSelection().removeAllRanges) {
		window.getSelection().removeAllRanges();
	}
};

const addListeners = () => {
	window.addEventListener('mouseup', onMouseUp);
	backdrop.addEventListener('click', onBackdropClick);
	saveButton.addEventListener('click', onSave);
};

const addElements = () => {
	document.body.appendChild(
		createElement('div', {
			children: [backdrop, menu],
		}),
	);
};

const checkQueryParams = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const path = urlParams.get(QueryParams.PATH);
	const start = Number(urlParams.get(QueryParams.START));
	const end = Number(urlParams.get(QueryParams.END));

	if (!path || Number.isNaN(start) || Number.isNaN(end)) {
		return;
	}

	const el = document.querySelector(path);

	if (!el) {
		return;
	}

	const { textContent } = el;
	const textBefore = textContent.substring(0, start);
	const text = textContent.substring(start, end);
	const textAfter = textContent.substring(end);
	const mark = createElement('mark', {
		className: highlightedText,
	});

	const children = Array.from(el.children);
	const hasElements = children.length > 0;
	if (hasElements) {
		console.log(text);
		// console.log(el.);

		children.reduce((index, child, currentIndex) => {
			const startElement = text.indexOf(child.textContent);
			const endElement = startElement + child.textContent.length;

			console.log(index, startElement, text.substring(index, startElement));

			mark.appendChild(
				document.createTextNode(text.substring(index, startElement)),
			);
			mark.appendChild(child);

			if (currentIndex === children.length - 1) {
				console.log(
					text.substring(endElement),
					index,
					startElement,
					endElement,
				);

				mark.appendChild(document.createTextNode(text.substring(endElement)));
			} else {
				const nextChild = children[index + 1];
				const startNextElement = text.indexOf(nextChild.textContent);
				mark.appendChild(
					document.createTextNode(text.substring(endElement, startNextElement)),
				);
			}

			return endElement;
		}, 0);
	} else {
		mark.appendChild(document.createTextNode(text));
	}

	el.scrollIntoView({
		behavior: 'smooth',
	});

	el.innerHTML = '';
	el.appendChild(document.createTextNode(textBefore));
	el.appendChild(mark);
	el.appendChild(document.createTextNode(textAfter));
};

const setup = () => {
	addListeners();
	addElements();
	checkQueryParams();
};

setup();
