import { useState } from 'react';
import EventCard from './EventCard';
import LoadingCard from './LoadingCard';
import './EventsList.css';

function EventsList({ events, selectedLocation, loading }) {
  const [sortBy, setSortBy] = useState('date');

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.event_date) - new Date(b.event_date);
    }
    return a.name.localeCompare(b.name);
  });

 if (loading) {
    return (
      <div className="events-list">
        <div className="events-header">
          <h2>Loading Concerts...</h2>
        </div>
        <div className="events-grid">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="events-list">
      <div className="events-header">
        <h2>
          {selectedLocation ? `${selectedLocation} Concerts` : 'All Concerts'}
          <span className="event-count">({events.length})</span>
        </h2>
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
          <p>No events found for this location.</p>
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

export default EventsList;