// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/router');
const app = express();
const PORT = 8080/* process.env.PORT || 4000 */;

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://ktao:z4byPOvyyzZzarCn@ms.1qbqx7r.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ["https://mapstudio.azurewebsites.net:8080"],
  credentials: true
}))

// Routes
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for running tests