import { css } from 'goober';
import { createElement, setStyles, px } from './utils/elements';
import { getSelection } from './utils';

let currentSelection: ReturnType<typeof getSelection>;

const caretSize = 8;
const color = '#FAE704';
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
	console.log('saving', currentSelection);

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

const setup = () => {
	addListeners();
	addElements();
};

setup();
