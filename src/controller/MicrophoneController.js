import { ClassEvents } from '../utils/ClassEvents';
import { Format } from '../utils/Format';

export class MicrophoneController extends ClassEvents {
	constructor() {
		super();

		this._mineType = 'audio/webm';
		this._stream = null;

		navigator.mediaDevices
			.getUserMedia({
				audio: true,
			})
			.then(stream => {
				this._stream = stream;
				this.trigger('ready', this._stream);
			})
			.catch(error => {
				console.error(error);
			});
	}

	stop() {
		this._stream.getTracks().forEach(track => {
			track.stop();
		});
	}

	play() {
		let reader = new FileReader();

		reader.onload = e => {
			this._audio = new Audio(reader.result);

			// this._audio.srcObject = stream;
			this._audio.play();
			// this.trigger('play', this._audio);
		};
		reader.readAsDataURL(this._audioFile);
	}

	startTimer() {
		let start = Date.now();

		this._recordMicrophoneInterval = setInterval(() => {
			this.trigger('recordtimer', Date.now() - start);
		}, 100);
	}

	stopTimer() {
		clearInterval(this._recordMicrophoneInterval);
		this.trigger('stoptimer');
	}

	startRecorder() {
		if (this._stream) {
			this._mediaRecorder = new MediaRecorder(this._stream, { mineType: this._mineType });
			this._recordedChunks = [];
			this._mediaRecorder.addEventListener('dataavailable', media => {
				if (media.data.size > 0) {
					this._recordedChunks.push(media.data);
				}
			});

			this._mediaRecorder.addEventListener('stop', media => {
				let blob = new Blob(this._recordedChunks, {
					type: this._mineType,
				});
				let filename = `rec_${Date.now()}.webm`;
				let file = new File([blob], filename, {
					type: this._mineType,
					lastModified: Date.now(),
				});
				this._audioFile = file;
				// this.play();
			});

			this._mediaRecorder.start();
			this.startTimer();
		}
	}

	stopRecorder() {
		if (this._stream) {
			this._mediaRecorder.stop();
			this.stop();
			this.stopTimer();
		}
	}
}
