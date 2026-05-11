import React, { useState, useEffect } from 'react';
import apartments from '../Components/Apartments';
import { NavLink, useNavigate } from 'react-router-dom';

import './Home.css';

const Home = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [apartmentsList, setApartmentsList] = useState(() => {
        const savedApartments = localStorage.getItem('apartments');

        return savedApartments
            ? JSON.parse(savedApartments)
            : apartments;
    });

    const [showModal, setShowModal] = useState(false);

    const [newApartment, setNewApartment] = useState({
        name: '',
        status: '',
        address: '',
        website: ''
    });

    useEffect(() => {
    localStorage.setItem('apartments', JSON.stringify(apartmentsList));
}, [apartmentsList]);

    const navigate = useNavigate();

    const filteredApartments = activeFilter === 'All'
        ? apartmentsList
        : apartmentsList.filter(apartment => apartment.status === activeFilter);

    const handleAddApartment = () => {
    if (
        !newApartment.name ||
        !newApartment.address ||
        !newApartment.status
    ) {
        alert('Please fill out all required fields');
        return;
    }

    const apartmentToAdd = {
        id: Date.now(),
        ...newApartment
    };

    setApartmentsList((prev) => [...prev, apartmentToAdd]);

    setNewApartment({
        name: '',
        status: '',
        address: '',
        website: ''
    });

    setShowModal(false);
};


  return (
    <div className="app-container">
      <h1 className="title">Apartment Tracking</h1>

      <div className="top-nav">
        <button
        className={`nav-button ${activeFilter === 'All' ? 'active' : ''}`}
        onClick={() => setActiveFilter('All')}
        >
            All
        </button>

        <button
        className={`nav-button ${activeFilter === 'Emailed' ? 'active' : ''}`}
        onClick={() => setActiveFilter('Emailed')}
        >
            Emailed
        </button>
        <button
        className={`nav-button ${activeFilter === 'Scheduled' ? 'active' : ''}`}
        onClick={() => setActiveFilter('Scheduled')}
        >
            Scheduled
        </button>
        <button
        className={`nav-button ${activeFilter === 'Applied' ? 'active' : ''}`}
        onClick={() => setActiveFilter('Applied')}
        >
            Applied
        </button>
        <NavLink to="/calendar" className="calendar-link">
            Calendar
        </NavLink>
      </div>

      <div className="apartments-list">
        {filteredApartments.map(apartment => (
            <div key={apartment.id} className="apartment-card" onClick={() => navigate(`/apartment/${apartment.id}`)}>
                <h2>{apartment.name}</h2>
                <div className={`status-pill ${apartment.status.toLowerCase()}`}>{apartment.status}</div>
            </div>
        ))}

        <div className="add-card" onClick={() => setShowModal(true)}>
            +
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Apartment</h2>

                <input
                type="text"
                placeholder="Name"
                value={newApartment.name}
                onChange={(e) => setNewApartment({ ...newApartment, name: e.target.value })}
                />

                <input
                type="text"
                placeholder="Address"
                value={newApartment.address}
                onChange={(e) => setNewApartment({ ...newApartment, address: e.target.value })}
                />

                <select
                value={newApartment.status}
                onChange={(e) => setNewApartment({ ...newApartment, status: e.target.value })}
                >
                    <option value="">Select Status</option>
                    <option value="Emailed">Emailed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Applied">Applied</option>
                </select>

                <input
                type="text"
                placeholder="Website"
                value={newApartment.website}
                onChange={(e) => setNewApartment({ ...newApartment, website: e.target.value })}
                />

                <div className="modal-buttons">
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                    <button onClick={handleAddApartment}>Add</button>
                </div>
            </div>
        </div>
      )}
  </div>
  );
};

export default Home;