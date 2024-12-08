import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Home({ userId, name }) {
  const navigate = useNavigate();

  const [userUrls, setUserUrls] = useState([]);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedOperation, setShortenedOperation] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  // Fetch user URL history
  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        const response = await fetch('/api/url/userData', {
          method: 'GET',
          credentials: 'include', // Include cookies for auth
        });

        const data = await response.json();
        if (response.ok) {
          setUserUrls(data); // Set the URL history
        } else {
          console.error('Error fetching user URL data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user URL data:', error);
      }
    };

    fetchUserUrls();
  }, [shortenedOperation]);

  useEffect(() => {
    const fetchQrCode = async () => {
      if (!shortenedUrl) return; // Ensure shortened URL exists before making the request
      
      try {
        // Send only the shortened part of the URL (not the full URL)
        const shortenedUrlPath = shortenedUrl.replace('http://localhost:3000/api/url/', ''); // Extract the shortened URL part
        const response = await fetch(`/api/url/qr/${shortenedUrlPath}`);
        const data = await response.json();
        setQrCode(data.qrCode); // Set the QR code response
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };
  
    fetchQrCode();
  }, [shortenedUrl]); // Run effect when shortenedUrl changes
  

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error('Please enter a URL first.');
      return;
    }

    try {
      const response = await fetch('/api/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl, userId }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setShortenedUrl(data.shortUrl);
        setShortenedOperation(true);
        setOriginalUrl('');
        // Refresh the userUrls list after shortening
        setUserUrls((prevUrls) => [...prevUrls, data]);
      } else {
        toast.error(`${data.error}`);
        console.error(`${data.error}`);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const handleDeleteUrl = async (id) => {
    try {
      const response = await fetch(`/api/url/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUserUrls((prevUrls) => prevUrls.filter((url) => url._id !== id)); // Remove deleted URL from state
        toast.success('URL deleted successfully');
      } else {
        console.error('Error deleting URL');
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  const Logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Logged out successfully');
        window.location.reload();
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <>
      <div>
        <header>
          <div className="logo">
            <h2>URL Shortener</h2>
          </div>
          <div className="buttons">
            <a onClick={Logout}>Logout</a>
          </div>
        </header>
        <main>
          <div className="hero">
            <h3>{'Shorten Your Loooong Links :)'}</h3>
            <div className="shorten-container">
              <input
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Enter the link here"
              />
              <button className="shorten-btn" onClick={shortenUrl}>
                Shorten Now!
              </button>
            </div>
            {shortenedOperation && (
              <div className="shortened-url-container">
                <p>Shortened URL:</p>
                <span className="shortened-url">
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortenedUrl}
                  </a>
                </span>
                <button id="shorten-copy-btn" onClick={copyUrl}>
                  <i class="fa-solid fa-copy"></i>
                </button>

                <div className="qr-code">
                  {/* <p>QR Code for the Shortened URL:</p> */}
                  <div>
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code" />
                    ) : (
                      <p>Loading QR code...</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="history">
            <h2 className="user">WELCOME {name.toUpperCase()}!</h2>
            <h3>Your History</h3>
            <p className="tip">
              Tip: Refresh the page to update the url history data in the table
            </p>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Original Link</th>
                    <th>Short Link</th>
                    <th style={{ width: '7%' }}>Total Visits</th>
                    <th>Last Visit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userUrls.length > 0 ? (
                    userUrls.map((url, index) => (
                      <tr key={index}>
                        <td>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url.originalUrl}
                          </a>
                        </td>
                        <td>
                          <a
                            href={`http://localhost:3000/api/url/${url.shortenedUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`http://localhost:3000/api/url/${url.shortenedUrl}`}
                          </a>
                        </td>
                        <td>{url.visits}</td>
                        <td>
                          {url.lastVisit
                            ? new Date(url.lastVisit).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td>
                          <button
                            onClick={() => navigate(`/urlDetails/${url._id}`)}
                            className="view-details-btn"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteUrl(url._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No URL history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
