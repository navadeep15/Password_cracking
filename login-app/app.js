const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Dummy credentials
const validUsername = 'admin';
const validPassword = 'password1';

// Serve the login page (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === validUsername && password === validPassword) {
        res.send('Login successful!');
    } else {
        res.send('Invalid login');
    }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});