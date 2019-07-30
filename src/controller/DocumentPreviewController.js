const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController {
	constructor(file) {
		this._file = file;
	}

	isTextFile() {
		return this._file.type.includes('plain/text');
	}

	isImageFile() {
		return this._file.type.includes('image/');
	}

	isPdfFile() {
		return this._file.type.includes('application/pdf');
	}

	isZipFile() {
		return this._file.type.includes('application/zip');
	}

	checkForFileTypes(types) {
		for (let i in types) {
			if (this._file.type.includes(types[i])) {
				return true;
			}
		}
		return false;
	}

	isExcelFile() {
		return this.checkForFileTypes(['excel', 'spreadsheetml']);
	}

	isPowerPointFile() {
		return this.checkForFileTypes(['powerpoint', 'presentationml']);
	}

	isWordFile() {
		return this.checkForFileTypes(['msword', 'wordprocessingml']);
	}

	getFileType() {
		if (this.isTextFile()) return 'txt';

		if (this.isImageFile()) return 'image';

		if (this.isPdfFile()) return 'pdf';

		if (this.isExcelFile()) return 'xls';

		if (this.isPowerPointFile()) return 'ppt';

		if (this.isWordFile()) return 'doc';

		if (this.isZipFile()) return 'zip';

		return 'generic';
	}

	getPreviewData() {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			if (this.getFileType() === 'pdf') {
				reader.onload = e => {
					pdfjsLib
						.getDocument(new Uint8Array(reader.result))
						.promise.then(pdf => {
							pdf.getPage(1)
								.then(page => {
									let viewport = page.getViewport({ scale: 1 });
									let canvas = document.createElement('canvas');
									let canvasContext = canvas.getContext('2d');

									canvas.height = viewport.height;
									canvas.width = viewport.width;

									page.render({
										canvasContext,
										viewport,
									})
										.promise.then(() => {
											let s = pdf.numPages > 1 ? 's' : '';
											resolve({
												src: canvas.toDataURL('image/png'),
												type: 'image',
												info: `${pdf.numPages} página${s}`,
											});
										})
										.catch(err => {
											reject(err);
										});
								})
								.catch(err => {
									reject(err);
								});
						})
						.catch(err => {
							reject(err);
						});
				};
				reader.onerror = err => {
					reject(err);
				};
				reader.readAsArrayBuffer(this._file);
			} else {
				reader.onload = e => {
					resolve({
						src: reader.result,
						type: this.getFileType(),
						info: this._file.name,
					});
				};
				reader.onerror = err => {
					reject(err);
				};
				reader.readAsDataURL(this._file);
			}
		});
	}
}
