import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from './EventCard';
import './AllEvents.css';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [eventsRes, locationsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/events'),
        axios.get('http://localhost:3000/api/locations')
      ]);
      setEvents(eventsRes.data.data);
      setLocations(locationsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.location === selectedFilter);

  // Apply search filter
  const searchedEvents = searchQuery.trim() === ''
    ? filteredEvents
    : filteredEvents.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const sortedEvents = [...searchedEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.event_date) - new Date(b.event_date);
    }
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return <div className="loading-page">Loading all events...</div>;
  }

  return (
    <div className="all-events">
      <div className="all-events-header">
        <Link to="/" className="back-button">← Back to Map</Link>
        <h1>🎸 All Swiss Concerts</h1>
        <p className="events-subtitle">Browse all concerts across Switzerland</p>
      </div>

      <div className="events-filters">
        <div className="search-section">
          <label>🔍 Search:</label>
          <input 
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <label>Filter by Location:</label>
          <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="all">All Locations ({events.length})</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location} ({events.filter(e => e.location === location).length})
              </option>
            ))}
          </select>
        </div>

        <div className="sort-section">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="result-count">
          Showing {sortedEvents.length} {sortedEvents.length === 1 ? 'concert' : 'concerts'}
        </div>
      </div>

      <div className="events-grid">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default AllEvents;