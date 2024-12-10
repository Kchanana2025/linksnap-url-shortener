# LinkSnap URL Shortener

LinkSnap is a simple and efficient URL shortener application that allows users to transform long, cumbersome URLs into compact and shareable links. This project is designed to streamline link sharing and tracking with ease.

---

## Features

- URL Shortening: Quickly shorten any long URL into a short, shareable link.
- Link Analytics: Track the number of clicks on the shortened URLs .
- Scalable Design: Built to handle multiple shortening requests simultaneously.
- URL Shortening: Converts long URLs into shorter, easy-to-share versions that redirect to the original URL.
- URL Redirection: Redirects users from a shortened URL to the original URL using HTTP status codes like 301 or 302.
- Click Tracking: Monitors and records how many times a shortened URL is clicked by users.
- Basic Analytics: Provides insights such as click counts, location, and device information for shortened URLs.
- Input Validation: Ensures the provided URL is valid and properly formatted before shortening.
- API Authentication: Verifies that only authorized users or applications can access and interact with the URL shortening service.
- QR Code Generation: Creates a scannable QR code that redirects to a shortened URL when scanned.
- Link Expiration: Sets a time or usage limit after which the shortened URL becomes inactive.
- Rate Limiting: Restricts the number of requests or clicks on a URL within a specific time frame to prevent abuse.

---

## Installation

Follow these steps to set up the project locally:

1. Clone the Repository
   ```bash
   git clone https://github.com/Kchanana2025/linksnap-url-shortener.git
   cd linksnap-url-shortener
   
2. **Install Dependencies**  
   Ensure you have Node.js installed, then run:  

   ```bash
   npm install


3. **Set Up Environment Variables**  
   Create a `.env` file in the root directory and add the following configurations:  

   ```bash
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:3000

4. Run the Application  
   Start the server by running:  

   ```bash
   npm start

---

## Usage
Open the application in your browser.
Enter the long URL you wish to shorten.
Click the Shorten button to generate a short link.
Share the short link anywhere and track its performance (if analytics are supported).

---

## Technologies Used
Frontend: React
Backend: Node.js, Express.js
Database: MongoDB

