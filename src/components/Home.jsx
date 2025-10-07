import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SwitzerlandMap from './SwitzerlandMap';
import EventsList from './EventsList';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all events on component mount
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Fetch all events
  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  // Handle location click - navigate to detail page
  const handleLocationClick = (location) => {
    navigate(`/location/${location}`);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>🎸 Swiss Concert Events</h1>
        <p>Discover amazing concerts across Switzerland</p>
      </header>

      <main className="home-main">
        <div className="map-section">
          <h2>Select a Location</h2>
          <SwitzerlandMap 
            onLocationClick={handleLocationClick}
          />
          <Link to="/events" className="view-all-btn">
            View All Events
          </Link>
        </div>

        <div className="events-section">
          <div className="events-preview-header">
            <h2>Recent Events</h2>
            <Link to="/events" className="see-all-link">See All →</Link>
          </div>
          <EventsList 
            events={events.slice(0, 6)}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default Home;