require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./modules/User');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Login Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Login Handler
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      res.send(`<h2>Welcome, ${user.username}!</h2>`);
    } else {
      res.send('<h2>Invalid username or password</h2>');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('<h2>Internal Server Error</h2>');
  }
});

// Signup Handler
app.post('/signup', async (req, res) => {
  try {
    const { username, password, email, contactNo } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('<h2>User already exists. <a href="/signup">Try again</a></h2>');
    }

    const newUser = new User({
      username,
      password,
      email,
      contactNo
    });

    await newUser.save();
    res.send('<h2>Signup successful. <a href="/">Login now</a></h2>');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('<h2>Internal Server Error</h2>');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
