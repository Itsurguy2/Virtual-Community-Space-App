import { useState, useEffect } from 'react';
import EventModal from './EventModal';
import './EventCard.css';

function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const eventDate = new Date(event.event_date);
      const diff = eventDate - now;

      if (diff < 0) {
        setIsPast(true);
        const pastDiff = Math.abs(diff);
        const days = Math.floor(pastDiff / (1000 * 60 * 60 * 24));
        setTimeRemaining(`Event ended ${days} days ago`);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days} days, ${hours} hours remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours} hours, ${minutes} minutes remaining`);
      } else {
        setTimeRemaining(`${minutes} minutes remaining`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [event.event_date]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const addToCalendar = () => {
    const eventDate = new Date(event.event_date);
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatCalendarDate(eventDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(calendarUrl, '_blank');
  };

  return (
    <div 
      className={`event-card ${isPast ? 'past-event' : 'upcoming-event'}`}
      onClick={() => setShowModal(true)}
    >
      <div className="event-header">
        <h3>{event.name}</h3>
        <span className="event-location">📍 {event.location}</span>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-footer">
        <div className="event-date">
          📅 {formatDate(event.event_date)}
        </div>
        <div className={`event-countdown ${isPast ? 'past' : 'upcoming'}`}>
          ⏱️ {timeRemaining}
        </div>
        {!isPast && (
          <button className="add-to-calendar-btn" onClick={addToCalendar}>
            📆 Add to Calendar
          </button>
        )}
      </div>

      {isPast && <div className="past-badge">PAST EVENT</div>}
      
      {showModal && (
        <EventModal event={event} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default EventCard;