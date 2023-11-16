// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();
const PORT =  process.env.PORT || 4000 ;

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://ktao:z4byPOvyyzZzarCn@ms.1qbqx7r.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["https://mapstudio-cse416.web.app"],
  credentials: true
}))

// Routes
const authRoutes = require('./routes/auth-router');
app.use('/auth', authRoutes);
const routes = require('./routes/router');
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for running tests