import { useState } from 'react';
import axios from 'axios';
import './AddEventForm.css';

function AddEventForm({ onEventAdded, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    event_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const locations = ['Zurich', 'Geneva', 'Bern', 'Lucerne'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/events', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onEventAdded();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-success">
        <div className="success-icon">✅</div>
        <h3>Event Created Successfully!</h3>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="add-event-form">
      <h2>🎸 Add New Concert</h2>
      
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Concert Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Rock Festival 2025"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select a city...</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the concert..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_date">Date & Time *</label>
          <input
            type="datetime-local"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEventForm;