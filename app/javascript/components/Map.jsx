import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Map = ({ locations = [] }) => {
  const defaultPosition = [-0.094458, 34.7503131]; // Default to Kisumu
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This ensures the component only renders on the client, not during SSR
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div style={{ height: "500px", width: "100%", background: "#f0f0f0" }}>Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={13} 
      style={{ height: "500px", width: "100%" }}
      key={Math.random()} // Force re-render on data change
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>Coordinates: {location.latitude}, {location.longitude}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;