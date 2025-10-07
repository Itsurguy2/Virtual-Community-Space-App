import './SwitzerlandMap.css';

function SwitzerlandMap({ onLocationClick, selectedLocation }) {
  const locations = [
    { name: 'Zurich', x: 65, y: 35 },
    { name: 'Geneva', x: 15, y: 70 },
    { name: 'Bern', x: 45, y: 55 },
    { name: 'Lucerne', x: 60, y: 50 }
  ];

  return (
    <div className="switzerland-map">
      <svg viewBox="0 0 100 100" className="map-svg">
        {/* Switzerland outline (simplified) */}
        <path
          d="M 10,60 Q 15,45 25,40 L 35,35 L 45,30 L 55,28 L 65,30 L 75,35 L 85,45 Q 90,55 88,65 L 85,75 L 75,80 L 60,82 L 45,80 L 30,75 L 20,70 Z"
          className="country-outline"
        />

        {/* Location markers */}
        {locations.map((location) => (
          <g key={location.name}>
            <circle
              cx={location.x}
              cy={location.y}
              r="4"
              className={`location-marker ${selectedLocation === location.name ? 'selected' : ''}`}
              onClick={() => onLocationClick(location.name)}
            />
            <text
              x={location.x}
              y={location.y - 8}
              className="location-label"
              onClick={() => onLocationClick(location.name)}
            >
              {location.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default SwitzerlandMap;
