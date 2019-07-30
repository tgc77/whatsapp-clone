const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

export class Firebase {
	constructor() {
		this._config = {
			apiKey: 'AIzaSyBQ6i2SWSdeYFn2-XpbZpHHPdyRxNdU-h4',
			authDomain: 'whatsapp-2809f.firebaseapp.com',
			databaseURL: 'https://whatsapp-2809f.firebaseio.com',
			projectId: 'whatsapp-2809f',
			storageBucket: 'whatsapp-2809f.appspot.com',
			messagingSenderId: '698054767569',
			appId: '1:698054767569:web:fdbfb6519616bebb',
		};

		this.init();
	}

	init() {
		if (!this._initialized) {
			firebase.initializeApp(this._config);

			firebase.firestore().settings({});

			this._initialized = true;
		}
	}

	initAuth() {
		return new Promise((resolve, reject) => {
			let provider = new firebase.auth.GoogleAuthProvider();
			// provider.addScope('profile');
			// provider.addScope('email');
			// provider.addScope('openid');

			firebase
				.auth()
				.signInWithPopup(provider)
				.then(result => {
					console.log('result', result);

					let token = result.credential.accessToken;
					let user = result.user;

					resolve({ user, token });
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static db() {
		return firebase.firestore();
	}

	static hd() {
		return firebase.storage();
	}
}
