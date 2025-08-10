require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');
const { verifyJWT } = require('./middleware/verifyJWT');

// Routes
const userRoutes = require('./routes/userRoutes');
const registerRoutes = require('./routes/registerRoutes');
const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require('./routes/refreshRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const profileRoutes = require('./routes/profileRoutes');
const blogPostRoutes = require('./routes/blogPostRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Main DB Routes
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);
app.use('/auth', authRoutes);
app.get('/auth/verify', verifyJWT, (req, res) => {
    res.json({ message: `Hello ${req.user.firstName}, you have successfully logged in.` });
});
app.use('/auth/refresh', refreshRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Profile Routes
app.use('/profile', profileRoutes);

// Blog Post Routes
app.use('/api/posts', blogPostRoutes);

// Start server only if DB connection succeeds
(async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`✅ Server running on port: ${port}`);
        });
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
})();
