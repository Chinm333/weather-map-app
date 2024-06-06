import React, { useState } from 'react';
import { Marker, useMapEvent } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const MapDisplay = ({ initialLat, initialLon, onMapClick }) => {
  const [position, setPosition] = useState([initialLat, initialLon]);

  useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    onMapClick(lat, lng);
  });

  return <Marker position={position} icon={customIcon} />;
};

export default MapDisplay;