import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapDisplay from './Map';

const MapWrapper = ({ lat, lon, zoom, onMapClick }) => (
  
  <MapContainer center={[lat, lon]} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <MapDisplay initialLat={lat} initialLon={lon} onMapClick={onMapClick} />
  </MapContainer>
);

export default MapWrapper;