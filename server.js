"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/auth");
require("firebase/compat/firestore");
require('dotenv').config({ path: './.env' });
require('./database/db.js');
const app = (0, express_1.default)();
// Initialize Firebase
app_1.default.initializeApp({
    apiKey: "AIzaSyDkYMidkDV2ubHRJu0Hfi8kv21uFdge_K4",
    authDomain: "camping-dev.firebaseapp.com",
    projectId: "camping-dev",
    storageBucket: "camping-dev.appspot.com",
    messagingSenderId: "1078431168019",
    appId: "1:1078431168019:web:32d5ade817f44e876bf1e6"
});
// Use JSON as the request body parser
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,content-type");
    next();
});
// Define the POST endpoint for sign-up
app.post('/signup', async (req, res) => {
    // Destructure the email and password from the request body
    const { email, password, password2 } = req.body;
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
        const user = await app_1.default
            .auth()
            .createUserWithEmailAndPassword(email, password);
        // Generate a JSON Web Token (JWT) for the user
        const secret = 'secret_key';
        const token = jwt.sign({ userId: user.user?.uid }, secret, { expiresIn: '1h' });
        // Send the JWT in the response
        res.json({ token });
    }
    catch (error) {
        // If an error occurs, send a 500 status code and the error message
        res.status(500).send(error.message);
    }
});
//login
app.post('/login', async (req, res) => {
    // Destructure the email and password from the request body
    const { email, password } = req.body;
    try {
        // Authenticate the user using Firebase
        const user = await app_1.default
            .auth()
            .signInWithEmailAndPassword(email, password);
        // Generate a JSON Web Token (JWT) for the user
        const token = jwt.sign({ userId: user.user?.uid }, 'secret_key', { expiresIn: '1h' });
        // Send the JWT in the response
        res.json({ token });
    }
    catch (error) {
        // If an error occurs, send a 401 status code and the error message
        res.status(401).json({ error: error });
    }
});
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
//logout
app.post('/logout', (req, res) => {
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
        const payload = jwt.verify(token, 'secret_key');
        // TODO: Do something with the payload, such as destroy the session in a database
        // Respond with a success message
        return res.json({ message: 'Logout successful' });
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
});
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map