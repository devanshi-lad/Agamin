import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://admin:1234@agamin-db.v9iydl5.mongodb.net/?appName=Agamin-DB";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// Database Structure
const UserSchema = new mongoose.Schema({
    username: String,
    bookmarks: [String],
    alerts: [{ id: String, value: Number }]
});
const User = mongoose.model('User', UserSchema);

// Save or Update User Data
app.post('/api/save', async (req, res) => {
    const { username, bookmarks, alerts } = req.body;
    try {
        let user = await User.findOneAndUpdate(
            { username },
            { bookmarks, alerts },
            { upsert: true, returnDocument: 'after' } // Updated this line
        );
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Load User Data
app.get('/api/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));