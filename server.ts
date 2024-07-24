const jwts = require('jsonwebtoken');
const exp = require('express');
const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');
require('dotenv').config({path : './.env'});
require('./database/db.js');

const app = exp();

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
app.use(exp.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // adjust the origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // methods to allow
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Content-Type']
}));
// Define the POST endpoint for sign-up
app.post('/api/signup', async (req: any, res: any) => {
  // Destructure the email and password from the request body
  const { email, password ,password2} = req.body;
 // Check if the passwords match
 if (password !== password2) {
  return res.status(400).json({ error: 'Passwords do not match' });
}
  try {
    // Generate a salt for bcrypt
    //const salt = await bcrypt.genSalt();

    // Hash the password using bcrypt
    //const hash = await bcrypt.hash(password, salt);

    // Create a new user in Firebase with the email and hashed password
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    // Generate a JSON Web Token (JWT) for the user
    const secret = 'secret_key';
    const token = jwts.sign({ userId: user.user?.uid}, secret,{expiresIn:'1h'});

    // Send the JWT in the response
    res.json({ token });
  } catch (error:any) {
    // If an error occurs, send a 500 status code and the error message
    res.status(500).send(error.message);
  }
});
//login

app.post('/api/login', async (req: any, res: any) => {
  // Destructure the email and password from the request body
  const { email, password } = req.body;

  try {
    // Authenticate the user using Firebase
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    // Generate a JSON Web Token (JWT) for the user
    const token = jwts.sign({ userId: user.user?.uid}, 'secret_key',{expiresIn:'1h'} );
    // Send the JWT in the response
    res.json({ token });
  } catch (error) {
    // If an error occurs, send a 401 status code and the error message
    res.status(401).json({ error: error });
  }
});

app.get('/', (req: any, res: any) => {
  res.send('Hi from Express!!');
});
//logout
app.post('/api/logout', (req: { headers: { authorization: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; json: (arg0: { message: string; }) => any; }) => {
  // Get the JWT from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  // Verify and decode the JWT
  try {
    const payload = jwts.verify(token, 'secret_key');
    // TODO: Do something with the payload, such as destroy the session in a database

    // Respond with a success message
    return res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});
const userRoutes = require('./routes/userRoutes')
app.use(userRoutes);
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});