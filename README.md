# Simple barcode and qr code scanner

## Installation

```sh
$ git clone https://github.com/rishi-singh26/Code_Scanner.git
clone this repository
$ npm install
install node_modules
$ expo upgrade
upgrade modules
```

### Firebase credentials setup

- Create a new folder named "Constants" inside "src".
- Inside "Constants" foldar create a file by name "Api.js"
- Inside "Api.js" copy the code below
- Add appropriate firebase credentials

```sh
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PRIJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const cloudStorage = firebase.storage();
```
