import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './UrlDetails.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function UrlDetails() {
  const { id } = useParams(); // Get URL ID from the route
  const navigate = useNavigate();
  const [urlDetails, setUrlDetails] = useState(null);
  const [visitData, setVisitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const response = await fetch(`/api/url/details/${id}`, { credentials: 'include' });
        const data = await response.json();

        if (response.ok) {
          setUrlDetails(data);

          // Process visit history to generate visit counts per date
          const visitCounts = data.visitHistory.reduce((acc, date) => {
            const formattedDate = new Date(date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            acc[formattedDate] = (acc[formattedDate] || 0) + 1;
            return acc;
          }, {});

          // Prepare data for the graph
          const formattedVisitData = Object.entries(visitCounts).map(([date, visits]) => ({
            date,
            visits,
          }));

          formattedVisitData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
          setVisitData(formattedVisitData);
        } else {
          setError(data.error || 'Failed to fetch URL details');
        }
      } catch (err) {
        setError('An error occurred while fetching URL details');
      } finally {
        setLoading(false);
      }
    };

    fetchUrlDetails();
  }, [id]);

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const graphData = {
    labels: visitData.map((visit) => visit.date), // Dates for the X-axis
    datasets: [
      {
        label: 'Visits Over Time',
        data: visitData.map((visit) => visit.visits), // Visit counts for the Y-axis
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'URL Visits Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Visits',
        },
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={goBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="url-details-container">
      <h1>URL Details</h1>
      {urlDetails && (
        <div className="details-card">
          <p>
            <strong>Original URL:</strong>{' '}
            <a href={urlDetails.originalUrl} target="_blank" rel="noopener noreferrer">
              {urlDetails.originalUrl}
            </a>
          </p>
          <p>
            <strong>Shortened URL:</strong>{' '}
            <a href={`http://localhost:3000/api/url/${urlDetails.shortenedUrl}`} target="_blank" rel="noopener noreferrer">
              {`http://localhost:3000/api/url/${urlDetails.shortenedUrl}`}
            </a>
          </p>
          <p>
            <strong>Total Visits:</strong> {urlDetails.visits}
          </p>
          <p>
            <strong>Last Visit:</strong>{' '}
            {urlDetails.lastVisit ? new Date(urlDetails.lastVisit).toLocaleString() : 'N/A'}
          </p>
          <button onClick={goBack} className="back-btn">
            Go Back
          </button>
        </div>
      )}
      <div className="graph-container">
        <h2>Visit Trends</h2>
        <Line data={graphData} options={graphOptions} />
      </div>
    </div>
  );
}

export default UrlDetails;
