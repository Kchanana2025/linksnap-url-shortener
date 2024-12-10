# LinkSnap URL Shortener

LinkSnap is a simple and efficient URL shortener application that allows users to transform long, cumbersome URLs into compact and shareable links. This project is designed to streamline link sharing and tracking with ease.

---

## Features

- URL Shortening: Quickly shorten any long URL into a short, shareable link.
- Link Analytics: Track the number of clicks on the shortened URLs .
- Scalable Design: Built to handle multiple shortening requests simultaneously.

---

## Installation

Follow these steps to set up the project locally:

1. Clone the Repository
   ```bash
   git clone https://github.com/Kchanana2025/linksnap-url-shortener.git
   cd linksnap-url-shortener
2. Install Dependencies
Ensure you have Node.js installed, then run:
   [npm install](https://docs.npmjs.com/cli/v9/commands/npm-install)




3.Set Up Environment Variables
Create a .env file in the root directory and add the following configurations:
PORT=3000
---
MONGODB_URI=your_mongodb_connection_string
---
BASE_URL=http://localhost:3000



4.Run the Application
npm start
The application will be live at http://localhost:3000.


---

##Usage
Open the application in your browser.
Enter the long URL you wish to shorten.
Click the Shorten button to generate a short link.
Share the short link anywhere and track its performance (if analytics are supported).

---

##Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB

