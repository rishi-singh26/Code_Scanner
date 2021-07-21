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

### Firebase credentials and Opencage API setup

- Create a new folder named "Constants" inside "src".
- Inside "Constants" foldar create a file by name "Api.js"
- Inside "Api.js" copy the code below
- Add appropriate firebase credentials
- Paste your Opencage API key in place of "YOUR_OPENCAGE_API_KEY"

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

// opencage api

const key = `YOUR_OPENCAGE_API_KEY`;

export const geoCoderApi = (latitude, longitude) => {
  return `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C%20${longitude}&key=${key}&language=en&pretty=1`;
};

```

### Google Maps Setup

- Rename the "dummy-app.json" file present in the root directory to "app.json".
- Inside "app.json" file replace "YOUR_GOOGLE_MAPS_API_KEY" with your google maps api key.

```sh
"config": {
  "googleMaps": {
    "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
  }
},
```
