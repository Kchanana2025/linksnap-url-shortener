const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js')
const urlRoutes = require('./routes/url.routes.js')
const demoRoutes = require('./routes/demo.routes.js')

const cors = require('cors');
const connectDB = require('./dbConnection');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');


require('dotenv').config();
connectDB();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true,
  });
  const app = express();
  const port = process.env.PORT || 3000;
  
  const corsOptions = {
    origin: true,
    credentials: true,
  };
  
// Sanitize all user input to avoid XSS attacks
app.use(xss());
app.use(limiter);
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());



app.get('/', (req, res) => {
  return res.send('Welcome, server running...');
});

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/demo", demoRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
