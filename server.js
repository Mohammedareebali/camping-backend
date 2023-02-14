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
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/auth");
require("firebase/compat/firestore");
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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Define the POST endpoint for sign-up
app.post('/signup', async (req, res) => {
    // Destructure the email and password from the request body
    const { email, password, password2 } = req.body;
    // Check if the passwords match
    const match = await bcrypt.compare(password, password2);
    console.log(password);
    console.log(password2);
    console.log(match);
    if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    try {
        // Generate a salt for bcrypt
        const salt = await bcrypt.genSalt();
        // Hash the password using bcrypt
        const hash = await bcrypt.hash(password, salt);
        // Create a new user in Firebase with the email and hashed password
        const user = await app_1.default
            .auth()
            .createUserWithEmailAndPassword(email, hash);
        // Generate a JSON Web Token (JWT) for the user
        const token = jwt.sign({ userId: user.user?.uid }, 'secret_key', { expiresIn: '15s' });
        // Send the JWT in the response
        res.json({ token });
    }
    catch (error) {
        // If an error occurs, send a 500 status code and the error message
        res.status(500).send(error.message);
    }
});
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=server.js.map