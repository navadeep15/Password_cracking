const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Dummy credentials for example
const validUsername = 'admin';
const validPassword = 'password1';

// Lockout configuration
const lockoutDuration = 5 * 60 * 1000; // 5 minutes
const failedAttempts = {}; // Track failed attempts by IP or username

// Serve the login page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rate limiter for additional protection (optional)
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 10, // Limit each IP to 10 login requests per minute
    handler: (req, res) => {
        res.status(429).send('Too many login attempts. Please try again later.');
    }
});

// Apply rate limiting middleware to login endpoint
app.use('/login', loginLimiter);

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;

    if (!failedAttempts[ip]) {
        failedAttempts[ip] = { count: 0, lockUntil: null };
    }

    const attempt = failedAttempts[ip];

    // Check if the IP is locked out
    if (attempt.lockUntil && Date.now() < attempt.lockUntil) {
        return res.status(403).send('Too many failed attempts. Please try again later.');
    }

    // Check credentials
    if (username === validUsername && password === validPassword) {
        delete failedAttempts[ip]; // Reset failed attempts on success
        return res.send('Login successful!');
    } else {
        attempt.count += 1;

        if (attempt.count >= 5) {
            // Lock out IP for a duration after 5 failed attempts
            attempt.lockUntil = Date.now() + lockoutDuration;
            attempt.count = 0; // Reset the count after locking
        }

        return res.status(401).send('Invalid login');
    }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});