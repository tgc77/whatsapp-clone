export class Format {
	static getCamelCaseBySeparator(str, sep = '-') {
		let result = str.split(sep).map((_str, index) => {
			return index === 0 ? _str.toLowerCase() : _str.charAt(0).toUpperCase() + _str.slice(1);
		});
		return result.join('');
	}

	static getCamelCase(str) {
		let div = document.createElement('div');

		div.innerHTML = `<div data-${str}="id"></div>`;

		return Object.keys(div.firstChild.dataset)[0];
	}

	static toTimer(timer) {
		let seconds = parseInt((timer / 1000) % 60);
		let minutes = parseInt((timer / (1000 * 60)) % 60);
		let hours = parseInt((timer / (1000 * 60 * 60)) % 24);

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		} else {
			return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
	}
}
