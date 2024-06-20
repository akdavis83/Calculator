const screen = document.querySelector('#screen h1');
const equals = document.querySelector('#equals');
const clear = document.querySelector('#clear');
const buttons = document.querySelectorAll('.button');
const num = document.querySelectorAll('.number');
const func = document.querySelectorAll('.func');

function display(nums) {
	screen.textContent =
		typeof nums !== 'number'
			? 'error'
			: nums.toString().includes('.') && nums.toString().length > 10
			? Number.parseFloat(nums).toFixed(7)
			: nums.toString().length > 14
			? Number.parseInt(nums).toExponential([8])
			: nums;
}

buttons.forEach((button) =>
	button.addEventListener('click', (e) => {
		if (e.target.hasAttribute('data-key')) {
			if (screen.textContent === '0' || screen.textContent === '') {
				if (e.target.id === 'decimal') {
					screen.textContent = '0.';
				} else if (
					screen.textContent === '' &&
					e.target.classList.contains('func')
				) {
					screen.textContent = '';
				} else {
					screen.textContent = e.target.getAttribute('data-key');
				}
			} else {
				if (
					e.target.classList.contains('func') &&
					screen.textContent
						.charAt(screen.textContent.length - 1)
						.match(/[\+\-\/\*\.]/)
				) {
					screen.textContent = screen.textContent.slice(
						0,
						screen.textContent.length - 1
					);
					screen.textContent += e.target.getAttribute('data-key');
				} else if (
					e.target.id == 'decimal' &&
					/\.(?!\d*[\*\/\+\-])/g.test(screen.textContent)
				) {
					screen.textContent = screen.textContent;
				} else {
					screen.textContent += e.target.getAttribute('data-key');
				}
			}
		}
	})
);

function clearFunc() {
	screen.textContent = '';
}

clear.addEventListener('click', clearFunc);

function execute(operation) {
	let arr = operation
		.replace(/\+/g, ',+,')
		.replace(/\-/g, ',-,')
		.replace(/\*/g, ',*,')
		.replace(/\//g, ',/,')
		.split(',');
	const multDiv = (index) => {
		if (arr[index] == '*') {
			arr.splice(
				arr.indexOf('*') - 1,
				3,
				`${
					Number(arr[arr.indexOf('*') - 1]) * Number(arr[arr.indexOf('*') + 1])
				}`
			);
		} else {
			arr.splice(
				arr.indexOf('/') - 1,
				3,
				`${
					Number(arr[arr.indexOf('/') - 1]) / Number(arr[arr.indexOf('/') + 1])
				}`
			);
		}
	};
	const addSub = (index) => {
		if (arr[index] == '+') {
			arr.splice(
				arr.indexOf('+') - 1,
				3,
				`${
					Number(arr[arr.indexOf('+') - 1]) + Number(arr[arr.indexOf('+') + 1])
				}`
			);
		} else {
			arr.splice(
				arr.indexOf('-') - 1,
				3,
				`${
					Number(arr[arr.indexOf('-') - 1]) - Number(arr[arr.indexOf('-') + 1])
				}`
			);
		}
	};

	while (arr.length > 1) {
		if (arr.includes('*') || arr.includes('/')) {
			multDiv(arr.findIndex((item) => item.match(/\*|\//)));
			continue;
		}
		if (arr.includes('+') || arr.includes('-')) {
			addSub(arr.findIndex((item) => item.match(/\+|\-/)));
			continue;
		}
	}
	return Number(arr[0]);
}

const afterEquals = (e) => {
	const { target } = e;
	if (
		target.classList.contains('number') ||
		target.classList.contains('decimal')
	) {
		if (target.id == 'decimal') {
			screen.textContent = '0.';
		} else {
			screen.textContent = target.getAttribute('data-key');
		}
		buttons.forEach((btn) => btn.removeEventListener('click', afterEquals));
	} else
		buttons.forEach((btn) => btn.removeEventListener('click', afterEquals));
};

equals.addEventListener('click', () => {
	display(execute(screen.textContent));
	if (screen.textContent == 'Infinity') {
		screen.textContent = 'Are you trying to kill me, dude?';
	}
	buttons.forEach((btn) => btn.addEventListener('click', afterEquals));
});
