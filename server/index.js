// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080/* process.env.PORT || 4000 */;

// Expend the size limit of json file in mongodb
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb', extended: true, parameterLimit: 50000}));


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
  origin: ["http://localhost:3000"],
  credentials: true
}))

// Routes
const authRoutes = require('./routes/auth-router');
app.use('/auth', authRoutes);
const postRoutes = require('./routes/post-router');
app.use('/discussion', postRoutes);
const commentRoutes = require('./routes/comment-router');
app.use('/comment', commentRoutes);
const mapRoutes = require('./routes/map-router');
app.use('/map', mapRoutes);
const routes = require('./routes/router');
app.use('/api', routes);

// Start the server
if (process.env.NODE_ENV !== 'test') { // don't listen when running tests
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // for running tests