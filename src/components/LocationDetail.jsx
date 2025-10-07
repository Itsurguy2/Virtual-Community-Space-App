import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from './EventCard';
import './LocationDetail.css';

function LocationDetail() {
  const { location } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchLocationEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchLocationEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/events/location/${location}`);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.event_date) - new Date(b.event_date);
    }
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return <div className="loading-page">Loading {location} events...</div>;
  }

  return (
    <div className="location-detail">
      <div className="location-header">
        <Link to="/" className="back-button">← Back to Map</Link>
        <h1>🎸 {location} Concerts</h1>
        <p className="location-subtitle">Discover amazing concerts in {location}</p>
      </div>

      <div className="events-controls">
        <div className="event-count-badge">
          {events.length} {events.length === 1 ? 'Concert' : 'Concerts'}
        </div>
        <div className="sort-controls">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No concerts found in {location}.</p>
          <Link to="/" className="back-link">View all locations</Link>
        </div>
      ) : (
        <div className="events-grid">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationDetail;