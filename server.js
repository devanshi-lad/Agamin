import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Fetch URI and Secret from .env (with fallbacks if running in an environment without them)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:1234@agamin-db.v9iydl5.mongodb.net/?appName=Agamin-DB";
const JWT_SECRET = process.env.JWT_SECRET || "default_agamin_secret";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// Database Structure
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Added password field
    bookmarks: [String],
    alerts: [{ id: String, value: Number }]
});
const User = mongoose.model('User', UserSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Access Denied. No token provided." });

    const token = authHeader.split(" ")[1]; // Format: "Bearer <token>"
    if (!token) return res.status(401).json({ message: "Access Denied. Invalid token format." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

// --- AUTHENTICATION ROUTES ---

// 1. Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            bookmarks: [],
            alerts: []
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid username or password" });

        // Create and assign a token
        const token = jwt.sign(
            { _id: user._id, username: user.username }, 
            JWT_SECRET, 
            { expiresIn: '7d' } // Token expires in 7 days
        );
        
        res.status(200).json({ 
            message: "Logged in successfully",
            token,
            user: { username: user.username, bookmarks: user.bookmarks, alerts: user.alerts }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PROTECTED ROUTES (Requires Login) ---

// 3. Save or Update User Data (Bookmarks & Alerts)
app.post('/api/save', verifyToken, async (req, res) => {
    // We use req.user.username from the verified token to ensure users only edit their own data
    const username = req.user.username; 
    const { bookmarks, alerts } = req.body;
    
    try {
        let user = await User.findOneAndUpdate(
            { username },
            { bookmarks, alerts },
            { new: true, upsert: true } // upsert ensures fallback creation if missing somehow
        );
        res.status(200).json({ message: "Data synced successfully", user: { bookmarks: user.bookmarks, alerts: user.alerts }});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Load current user's profile
app.get('/api/user/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json({ username: user.username, bookmarks: user.bookmarks, alerts: user.alerts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a public health check route to verify server is running
app.get('/', (req, res) => {
    res.send('🚀 Agamin Crypto Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));