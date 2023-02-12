import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import express from 'express';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = express();

// Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
})

// Use JSON as the request body parser
app.use(express.json());

// Define the POST endpoint for sign-up
app.post('/signup', async (req: express.Request, res: express.Response) => {
  // Destructure the email and password from the request body
  const { email, password } = req.body;

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
    const token = jwt.sign({ userId: user.user?.uid }, 'secret_key');

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
