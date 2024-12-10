import React, { useEffect } from 'react';
import './user/Home.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function DemoShortener() {
  const navigate = useNavigate();
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedOperation, setShortenedOperation] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      if (!shortenedUrl) return; // Ensure shortened URL exists before making the request
      
      try {
        // Send only the shortened part of the URL (not the full URL)
        const shortenedUrlPath = shortenedUrl.replace('http://localhost:3000/api/demo/', ''); // Extract the shortened URL part
        const response = await fetch(`/api/demo/qr/${shortenedUrlPath}`);
        const data = await response.json();
        setQrCode(data.qrCode); // Set the QR code response
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };
  
    fetchQrCode();
  }, [shortenedUrl]); // Run effect when shortenedUrl changes

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast.error('Please enter a URL first.');
      return;
    }

    try {
      const response = await fetch('/api/demo/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ demo_originalUrl: originalUrl }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        const shortenedUrl = data.shortUrl;
        console.log('Shortened URL:', shortenedUrl);
        setShortenedUrl(shortenedUrl);
        setShortenedOperation(true);
        setOriginalUrl('');
      } else {
        console.error('Error shortening URL:', data.error);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
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
          <a href='/api-docs' target="_blank" rel="noopener noreferrer">API Docs</a>
          <a onClick={goToLogin}>Login</a>
            <a onClick={goToRegister}>Register</a>
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
                  <i className="fa-solid fa-copy"></i>
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
          <div className="info">
            <p>
              <i className="fa-solid fa-circle-info"></i> Log in or Register now to
              view your data and activity!
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

export default DemoShortener;
