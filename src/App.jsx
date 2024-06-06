import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/weather" element={<WeatherPage />} />
    </Routes>
  );
};

export default App;