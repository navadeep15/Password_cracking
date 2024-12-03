const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy credentials: 
const validUsername = 'admin';
const validPassword = 'password1';

// Rate limiter configuration for login route

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `windowMs`
    message: "Too many login attempts. Please try again after a minute.", // Message sent when limit is exceeded
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            error: "Too many login attempts. Please try again after a minute."
        });
    }
});



// Apply the rate limiter only to the login route
app.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        res.send('Login successful!');
    } else {
        res.send('Invalid login');
    }
});

// Serve the login page (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
