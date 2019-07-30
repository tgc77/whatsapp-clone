import { Format } from '../utils/Format';
import { CameraController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Firebase } from '../utils/Firebase';

export class WhatsAppController {
	constructor() {
		this.initialize();

		this._firebase = new Firebase();
		this.initAuth();
	}

	/**
	 *
	 */
	initialize() {
		this.elementsPrototype();
		this.loadElements();
		this.initializeEvents();
	}

	initAuth() {
		this._firebase
			.initAuth()
			.then(response => {
				console.log('response', response);

				this._user = response.user;
				this._el.appContent.css({
					display: 'flex',
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	/**
	 *
	 */
	elementsPrototype() {
		Element.prototype.hide = function() {
			this.style.display = 'none';
			return this;
		};

		Element.prototype.show = function() {
			this.style.display = 'block';
			return this;
		};

		Element.prototype.toggle = function() {
			this.style.display = this.style.display === 'none' ? 'block' : 'none';
			return this;
		};

		Element.prototype.on = function(events, fn) {
			events.split(' ').forEach(event => {
				this.addEventListener(event, fn);
			});
			return this;
		};

		Element.prototype.css = function(styles) {
			for (let name in styles) {
				this.style[name] = styles[name];
			}
			return this;
		};

		Element.prototype.addClass = function(cls) {
			this.classList.add(cls);
			return this;
		};

		Element.prototype.removeClass = function(cls) {
			this.classList.remove(cls);
			return this;
		};

		Element.prototype.toggleClass = function(cls) {
			this.classList.toggle(cls);
			return this;
		};

		Element.prototype.hasClass = function(cls) {
			return this.classList.contains(cls);
		};

		HTMLFormElement.prototype.getForm = function() {
			return new FormData(this);
		};

		HTMLFormElement.prototype.toJSON = function() {
			let json = {};

			this.getForm().forEach((value, key) => {
				json[key] = value;
			});
			return json;
		};
	}

	/**
	 *
	 */
	loadElements() {
		this._el = [];

		document.querySelectorAll('[id]').forEach(element => {
			this._el[Format.getCamelCase(element.id)] = element;
		});
	}

	/**
	 *
	 */
	initializeEvents() {
		this._el.myPhoto.on('click', e => {
			this.closeAllLeftPanel();
			this._el.panelEditProfile.show();
			setTimeout(() => {
				this._el.panelEditProfile.addClass('open');
			}, 300);
		});

		this._el.btnClosePanelEditProfile.on('click', e => {
			this._el.panelEditProfile.removeClass('open');
		});

		this._el.btnNewContact.on('click', e => {
			this.closeAllLeftPanel();
			this._el.panelAddContact.show();
			setTimeout(() => {
				this._el.panelAddContact.addClass('open');
			}, 300);
		});

		this._el.btnClosePanelAddContact.on('click', e => {
			this._el.panelAddContact.removeClass('open');
		});

		this._el.photoContainerEditProfile.on('click', e => {
			this._el.inputProfilePhoto.click();
		});

		this._el.btnSavePanelEditProfile.on('click', e => {
			console.log(this._el.inputNamePanelEditProfile.innerHTML);
		});

		this._el.inputNamePanelEditProfile.on('click', e => {
			this._el.inputNamePanelEditProfile.innerHTML = '';
		});

		this._el.inputNamePanelEditProfile.on('keypress', e => {
			if (e.key === 'Enter') {
				e.preventDefault();
				this._el.btnSavePanelEditProfile.click();
			}
		});

		this._el.formPanelAddContact.on('submit', event => {
			event.preventDefault();

			let formData = this._el.formPanelAddContact.getForm();
		});

		this._el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {
			item.on('click', e => {
				this._el.home.hide();
				this._el.main.css({
					display: 'flex',
				});
			});
		});

		//================================= Attach events ====================================
		this._el.btnAttach.on('click', e => {
			e.stopPropagation();
			this._el.menuAttach.addClass('open');
			document.addEventListener('click', this.closeMenuAttach.bind(this), { once: true });
		});

		//============================== Attach Photo events ==================================
		this._el.btnAttachPhoto.on('click', e => {
			this._el.inputPhoto.click();
		});

		this._el.inputPhoto.on('change', e => {
			[...this._el.inputPhoto.files].forEach(file => {
				console.log(file);
			});
		});

		//============================== Attach Camera events ==================================
		this._el.btnAttachCamera.on('click', e => {
			this.closeAllMainPanel();
			this._el.panelCamera.addClass('open');
			this._el.panelCamera.css({
				height: 'calc(100% - 120px)',
			});

			this._camera = new CameraController(this._el.videoCamera);
		});

		this._el.btnClosePanelCamera.on('click', e => {
			this.closeAllMainPanel();
			this._el.panelMessagesContainer.show();
			this._camera.stop();
		});

		this._el.btnTakePicture.on('click', e => {
			let dataUrl = this._camera.takePicture();

			this._el.pictureCamera.src = dataUrl;
			this._el.pictureCamera.show();
			this._el.videoCamera.hide();
			this._el.btnReshootPanelCamera.show();
			this._el.containerTakePicture.hide();
			this._el.containerSendPicture.show();
		});

		this._el.btnReshootPanelCamera.on('click', e => {
			this._el.pictureCamera.hide();
			this._el.videoCamera.show();
			this._el.btnReshootPanelCamera.hide();
			this._el.containerTakePicture.show();
			this._el.containerSendPicture.hide();
		});

		this._el.btnSendPicture.on('click', e => {
			console.log(this._el.pictureCamera.src);
		});
		//============================== Attach Document events ==================================
		this._el.btnAttachDocument.on('click', e => {
			this.closeAllMainPanel();
			this._el.panelDocumentPreview.addClass('open');
			this._el.panelDocumentPreview.css({
				height: 'calc(100% - 120px)',
			});
			this._el.inputDocument.click();
		});

		this._el.inputDocument.on('change', e => {
			if (this._el.inputDocument.files.length) {
				this._el.panelDocumentPreview.css({
					height: '1%',
				});

				let file = this._el.inputDocument.files[0];

				this._documentPreviewController = new DocumentPreviewController(file);

				this._documentPreviewController
					.getPreviewData()
					.then(data => {
						console.log('data type:', data.type);

						if (data.type === 'image') {
							this._el.imgPanelDocumentPreview.src = data.src;
							this._el.infoPanelDocumentPreview.innerHTML = data.info;
							this._el.imagePanelDocumentPreview.show();
							this._el.filePanelDocumentPreview.hide();

							this._el.panelDocumentPreview.css({
								height: 'calc(100% - 115px)',
							});
						} else {
							this._el.iconPanelDocumentPreview.className = `jcxhw icon-doc-${data.type}`;
							this._el.filenamePanelDocumentPreview.innerHTML = data.info;
							this._el.imagePanelDocumentPreview.hide();
							this._el.filePanelDocumentPreview.show();

							this._el.panelDocumentPreview.css({
								height: 'calc(100% - 120px)',
							});
						}
					})
					.catch(err => {
						console.error(err);
					});
			}
		});

		this._el.btnClosePanelDocumentPreview.on('click', e => {
			this.closeAllMainPanel();
			this._el.panelMessagesContainer.show();
		});

		this._el.btnSendDocument.on('click', e => {
			console.log('send document');
		});

		//============================= Attach Contact events ===================================
		this._el.btnAttachContact.on('click', e => {
			this._el.modalContacts.show();
		});

		this._el.btnCloseModalContacts.on('click', e => {
			this._el.modalContacts.hide();
		});

		//============================= Microphone record events =================================
		this._el.btnSendMicrophone.on('click', e => {
			this._el.recordMicrophoneTimer.css({
				'font-size': '9pt',
			});

			this._el.recordMicrophone.show();
			this._el.btnSendMicrophone.hide();

			this._microphone = new MicrophoneController();

			this._microphone.on('ready', audio => {
				this._microphone.startRecorder();
			});

			this._microphone.on('recordtimer', timer => {
				this._el.recordMicrophoneTimer.innerHTML = Format.toTimer(timer);
			});

			this._microphone.on('stoptimer', () => {
				this._el.recordMicrophoneTimer.innerHTML = Format.toTimer(0);
			});
		});

		this._el.btnCancelMicrophone.on('click', e => {
			this._microphone.stopRecorder();
			this.closeRecordMicrophone();
		});

		this._el.btnFinishMicrophone.on('click', e => {
			this._microphone.stopRecorder();
			this.closeRecordMicrophone();
		});

		//=====================================================================
		this._el.inputText.on('keypress', e => {
			if (e.key === 'Enter' && !e.ctrlKey) {
				e.preventDefault();
				this._el.btnSend.click();
			}
		});

		this._el.inputText.on('keyup', e => {
			if (this._el.inputText.innerHTML.length) {
				this._el.inputPlaceholder.hide();
				this._el.btnSendMicrophone.hide();
				this._el.btnSend.show();
			} else {
				this._el.inputPlaceholder.show();
				this._el.btnSendMicrophone.show();
				this._el.btnSend.hide();
			}
		});

		this._el.btnSend.on('click', e => {
			console.log(this._el.inputText.innerHTML);
		});

		this._el.btnEmojis.on('click', e => {
			this._el.panelEmojis.toggleClass('open');
		});

		this._el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
			emoji.on('click', e => {
				let img = this._el.imgEmojiDefault.cloneNode();
				img.style.cssText = emoji.style.cssText;
				img.dataset.unicode = emoji.dataset.unicode;
				img.alt = emoji.dataset.unicode;

				emoji.classList.forEach(name => {
					img.classList.add(name);
				});

				let cursor = window.getSelection();

				if (!cursor.focusNode || !cursor.focusNode.id == 'input-text') {
					this._el.inputText.focus();
					cursor = window.getSelection();
				}

				let range = cursor.getRangeAt(0);
				range.deleteContents();

				let frag = document.createDocumentFragment();
				frag.appendChild(img);
				range.insertNode(frag);
				range.setStartAfter(img);

				this._el.inputText.dispatchEvent(new Event('keyup'));
			});
		});
		//=====================================================================
	}

	/**
	 *
	 */
	closeRecordMicrophone() {
		this._el.recordMicrophone.hide();
		this._el.btnSendMicrophone.show();
	}

	/**
	 *
	 */
	closeAllMainPanel() {
		this._el.panelMessagesContainer.hide();
		this._el.panelDocumentPreview.removeClass('open');
		this._el.panelCamera.removeClass('open');
	}

	/**
	 *
	 * @param {*} e
	 */
	closeMenuAttach(e) {
		document.removeEventListener('click', this.closeMenuAttach);
		this._el.menuAttach.removeClass('open');
	}

	/**
	 *
	 */
	closeAllLeftPanel() {
		this._el.panelAddContact.hide();
		this._el.panelEditProfile.hide();
	}
}
