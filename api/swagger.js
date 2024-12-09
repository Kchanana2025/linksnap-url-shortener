const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: ` <strong>Setup Guide:</strong><br> - To use this API, ensure you have an authentication token. The token is passed as a cookie in each request.<br> - Authenticate the user via the <strong>/auth/login</strong> endpoint to obtain a token.<br> - You can also call some endpoints without authentication for demo purposes.<br> - Make requests by passing the token in cookies.<br><br> <strong>Rate Limit:</strong><br> - <strong>Max Requests:</strong> 100 requests per 15 minutes per IP address.<br> - <strong>Rate Limiting Mechanism:</strong> Requests beyond the limit will receive a <em>429 Too Many Requests</em> response.<br><br> <strong>Error Codes:</strong><br> - <strong>400 Bad Request:</strong> Invalid input or missing required parameters.<br> - <strong>401 Unauthorized:</strong> Missing or invalid authentication token.<br> - <strong>404 Not Found:</strong> The requested resource was not found.<br> - <strong>500 Internal Server Error:</strong> A server-side issue occurred while processing the request.<br> - <strong>410 Gone:</strong> The requested URL has expired or is no longer valid.<br> `,
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        ShortenRequest: {
          type: 'object',
          properties: {
            demo_originalUrl: {
              type: 'string',
              description: 'The original long URL to be shortened',
              example: 'http://example.com/long-url',
            },
          },
          required: ['demo_originalUrl'],
        },
        ShortenResponse: {
          type: 'object',
          properties: {
            shortUrl: {
              type: 'string',
              example: 'http://localhost:3000/api/demo/abc123',
            },
          },
        },
        QrCodeResponse: {
          type: 'object',
          properties: {
            qrCode: {
              type: 'string',
              description: 'Base64 string for the QR code image',
              example: 'data:image/png;base64,...',
            },
          },
        },
        AuthRegisterRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
              example: 'securepassword',
            },
          },
          required: ['username', 'password'],
        },
        AuthLoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user',
              example: 'john_doe',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
              example: 'securepassword',
            },
          },
          required: ['username', 'password'],
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Unauthorized',
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Unauthorized',
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'URL not found',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Internal Server Error',
                  },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Invalid URL format',
                  },
                },
              },
            },
          },
        },
        Expired: {
          description: 'Resource expired',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'URL has expired',
                  },
                },
              },
            },
          },
        },
      },
      parameters: {
        token: {
          name: 'token',
          in: 'cookie',
          required: true,
          description: 'Authentication token of the user',
          schema: {
            type: 'string',
          },
        },
        ShortenedUrl: {
          name: 'shortenedUrl',
          in: 'path',
          required: true,
          description: 'The unique identifier for the shortened URL',
          schema: {
            type: 'string',
            example: 'abc123',
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description:
            'Registers a user with a hashed password and returns a JWT token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: {
                      type: 'string',
                      example: 'testuser',
                    },
                    password: {
                      type: 'string',
                      example: 'password123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'registered!',
                      },
                    },
                  },
                },
              },
            },
            500: {
              $ref: '#/components/responses/InternalServerError',
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login a user',
          description: 'Logs in a user and returns a JWT token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: {
                      type: 'string',
                      example: 'testuser',
                    },
                    password: {
                      type: 'string',
                      example: 'password123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'User logged in successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'logged in!',
                      },
                    },
                  },
                },
              },
            },
            404: {
              $ref: '#/components/responses/NotFound',
            },
            401: {
              description: 'Invalid password',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Invalid password',
                      },
                    },
                  },
                },
              },
            },
            500: {
              $ref: '#/components/responses/InternalServerError',
            },
          },
        },
      },
      '/auth/isAuthenticated': {
        get: {
          tags: ['Authentication'],
          summary: 'Check authentication',
          description: 'Verifies if the user is authenticated using the token.',
          responses: {
            200: {
              description: 'Authentication status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      isAuthenticated: {
                        type: 'boolean',
                        example: true,
                      },
                      userId: {
                        type: 'string',
                        example: 'userId12345',
                      },
                      name: {
                        type: 'string',
                        example: 'testuser',
                      },
                    },
                  },
                },
              },
            },
            500: {
              $ref: '#/components/responses/InternalServerError',
            },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout a user',
          description: 'Logs out the user by clearing the JWT token.',
          responses: {
            200: {
              description: 'User logged out successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Logged out successfully',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/routes/*.js'], // Make sure this path points to your route files
};

const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec.paths); // Check if paths are populated

module.exports = { swaggerUi, swaggerSpec };
