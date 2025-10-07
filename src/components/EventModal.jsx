import { useEffect } from 'react';
import './EventModal.css';

function EventModal({ event, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const isPast = new Date(event.event_date) < new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>{event.name}</h2>
          <span className={`modal-status ${isPast ? 'past' : 'upcoming'}`}>
            {isPast ? '🔴 Past Event' : '🟢 Upcoming'}
          </span>
        </div>

        <div className="modal-body">
          <div className="modal-info-row">
            <span className="modal-icon">📍</span>
            <div>
              <strong>Location</strong>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="modal-info-row">
            <span className="modal-icon">📅</span>
            <div>
              <strong>Date & Time</strong>
              <p>{formatDate(event.event_date)}</p>
            </div>
          </div>

          <div className="modal-info-row">
            <span className="modal-icon">📝</span>
            <div>
              <strong>Description</strong>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {!isPast && (
            <button className="modal-calendar-btn" onClick={addToCalendar}>
              📆 Add to Calendar
            </button>
          )}
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;