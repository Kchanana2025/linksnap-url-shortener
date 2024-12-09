const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes.js');
const urlRoutes = require('./routes/url.routes.js');
const demoRoutes = require('./routes/demo.routes.js');
const cors = require('cors');
const connectDB = require('./dbConnection');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const { swaggerUi, swaggerSpec } = require('./swagger.js'); 

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

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'URL Shortener API',
//       version: '1.0.0',
//       description: 'API documentation for the URL Shortener app.',
//       contact: {
//         name: 'Your Name',
//         email: 'your.email@example.com',
//       },
//       license: {
//         name: 'MIT',
//         url: 'https://opensource.org/licenses/MIT',
//       },
//     },
//     servers: [
//       {
//         url: `http://localhost:${port}`, // Dynamically get the port
//         description: 'Local server',
//       },
//     ],
//     components: {
//       responses: {
//         Unauthorized: {
//           description: 'Unauthorized',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   error: {
//                     type: 'string',
//                     example: 'Unauthorized',
//                   },
//                 },
//               },
//             },
//           },
//         },
//         NotFound: {
//           description: 'Resource not found',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   error: {
//                     type: 'string',
//                     example: 'URL not found',
//                   },
//                 },
//               },
//             },
//           },
//         },
//         InternalServerError: {
//           description: 'Internal Server Error',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   error: {
//                     type: 'string',
//                     example: 'Internal Server Error',
//                   },
//                 },
//               },
//             },
//           },
//         },
//         BadRequest: {
//           description: 'Bad Request',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: {
//                   error: {
//                     type: 'string',
//                     example: 'Invalid URL format',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       parameters: {
//         token: {
//           name: 'token',
//           in: 'cookie',
//           required: true,
//           description: 'Authentication token of the user',
//           schema: {
//             type: 'string',
//           },
//         },
//       },
//     },
//   },
//   apis: ['./routes/*.js'], // Path to your route files
// };

// const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(xss());
app.use(limiter);
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    return res.send('Welcome, server running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/demo', demoRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

module.exports = app;
