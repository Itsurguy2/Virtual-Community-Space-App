import './LoadingCard.css';

function LoadingCard() {
  return (
    <div className="loading-card">
      <div className="loading-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-badge"></div>
      </div>
      
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      
      <div className="loading-footer">
        <div className="skeleton skeleton-date"></div>
        <div className="skeleton skeleton-countdown"></div>
      </div>
    </div>
  );
}

export default LoadingCard;