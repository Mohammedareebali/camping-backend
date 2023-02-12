const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import * as firebase from "firebase/app";
import 'firebase/auth';

const express = require('express');
const app = express();

// Initialize Firebase
 firebase.initializeApp({
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID"
})



app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello from Express!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
