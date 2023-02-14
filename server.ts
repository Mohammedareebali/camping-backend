import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import express from 'express';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = express();

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDkYMidkDV2ubHRJu0Hfi8kv21uFdge_K4",
  authDomain: "camping-dev.firebaseapp.com",
  projectId: "camping-dev",
  storageBucket: "camping-dev.appspot.com",
  messagingSenderId: "1078431168019",
  appId: "1:1078431168019:web:32d5ade817f44e876bf1e6"
})

// Use JSON as the request body parser
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Define the POST endpoint for sign-up
app.post('/signup', async (req: express.Request, res: express.Response) => {
  // Destructure the email and password from the request body
  const { email, password ,password2} = req.body;
 // Check if the passwords match
 const match = await bcrypt.compare(password, password2);
 console.log(password)
 console.log(password2)
 console.log(match)
 if (password !== password2) {
  return res.status(400).json({ error: 'Passwords do not match' });
}
  try {
    // Generate a salt for bcrypt
    const salt = await bcrypt.genSalt();

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(password, salt);

    // Create a new user in Firebase with the email and hashed password
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, hash);

    // Generate a JSON Web Token (JWT) for the user
    const token = jwt.sign({ userId: user.user?.uid }, 'secret_key',{expiresIn:'15s'});

    // Send the JWT in the response
    res.json({ token });
  } catch (error:any) {
    // If an error occurs, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
});

app.get('/', (req: any, res: express.Response) => {
  res.send('Hello from Express!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
