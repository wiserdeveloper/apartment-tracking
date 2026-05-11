import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './Pages/Home';
import Calendar from './Pages/Calendar';
import ApartmentDetails from './Pages/ApartmentDetails';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/apartment/:id" element={<ApartmentDetails />} />
      </Routes>
    </>
  );
}

export default App;
