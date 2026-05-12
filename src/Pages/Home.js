import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { supabase } from '../supabaseClient';

import './Home.css';

const Home = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [apartmentsList, setApartmentsList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newApartment, setNewApartment] = useState({
    name: '',
    status: '',
    address: '',
    website: '',
    tour_date: ''
  });

  const navigate = useNavigate();

  const fetchApartments = async () => {
    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching apartments:', error);
      return;
    }

    setApartmentsList(data);
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const filteredApartments =
    activeFilter === 'All'
      ? apartmentsList
      : apartmentsList.filter(
          (apartment) => apartment.status === activeFilter
        );

  const handleAddApartment = async () => {
    if (
      !newApartment.name ||
      !newApartment.address ||
      !newApartment.status
    ) {
      alert('Please fill out all required fields');
      return;
    }

    if (newApartment.status === 'Scheduled' && !newApartment.tour_date) {
      alert('Please select a tour date and time');
      return;
    }

    const { error } = await supabase
      .from('apartments')
      .insert([
        {
          name: newApartment.name,
          address: newApartment.address,
          status: newApartment.status,
          website: newApartment.website,
          tour_date:
            newApartment.status === 'Scheduled'
              ? newApartment.tour_date
              : null
        }
      ]);

    if (error) {
      console.error('Error adding apartment:', error);
      return;
    }

    await fetchApartments();

    setNewApartment({
      name: '',
      status: '',
      address: '',
      website: '',
      tour_date: ''
    });

    setShowModal(false);
  };

  const upcomingTours = apartmentsList
    .filter((apt) => apt.status === 'Scheduled' && apt.tour_date)
    .sort((a, b) => new Date(a.tour_date) - new Date(b.tour_date));

  return (
    <div className="app-container">
      <div className="page-header">
        <h1 className="title">Apartment Tracking</h1>
      </div>

      {upcomingTours.length > 0 && (
        <div className="upcoming-dashboard">
          <h2>Upcoming Tours</h2>

          <div className="upcoming-scroll">
            {upcomingTours.map((apt) => (
              <div
                key={apt.id}
                className="upcoming-card"
                onClick={() => navigate(`/apartment/${apt.id}`)}
              >
                <div className="upcoming-name">{apt.name}</div>

                <div className="upcoming-date">
                  {new Date(apt.tour_date).toLocaleString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                <div className="upcoming-address">{apt.address}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="top-nav">
          <button
            className={`nav-button ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>

          <button
            className={`nav-button ${
              activeFilter === 'Emailed' ? 'active' : ''
            }`}
            onClick={() => setActiveFilter('Emailed')}
          >
            Emailed
          </button>

          <button
            className={`nav-button ${
              activeFilter === 'Scheduled' ? 'active' : ''
            }`}
            onClick={() => setActiveFilter('Scheduled')}
          >
            Scheduled
          </button>

          <button
            className={`nav-button ${
              activeFilter === 'Applied' ? 'active' : ''
            }`}
            onClick={() => setActiveFilter('Applied')}
          >
            Applied
          </button>

          <NavLink to="/calendar" className="calendar-link">
            📅
          </NavLink>
        </div>
      </div>

      <div className="apartments-list">
        {filteredApartments.map((apartment) => (
          <div
            key={apartment.id}
            className="apartment-card"
            onClick={() => navigate(`/apartment/${apartment.id}`)}
          >
            <h2>{apartment.name}</h2>

            <div className={`status-pill ${apartment.status.toLowerCase()}`}>
              {apartment.status}
            </div>
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
              onChange={(e) =>
                setNewApartment({
                  ...newApartment,
                  name: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Address"
              value={newApartment.address}
              onChange={(e) =>
                setNewApartment({
                  ...newApartment,
                  address: e.target.value
                })
              }
            />

            <select
              value={newApartment.status}
              onChange={(e) =>
                setNewApartment({
                  ...newApartment,
                  status: e.target.value,
                  tour_date:
                    e.target.value === 'Scheduled'
                      ? newApartment.tour_date
                      : ''
                })
              }
            >
              <option value="">Select Status</option>
              <option value="Emailed">Emailed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Applied">Applied</option>
            </select>

            {newApartment.status === 'Scheduled' && (
              <input
                type="datetime-local"
                value={newApartment.tour_date}
                onChange={(e) =>
                  setNewApartment({
                    ...newApartment,
                    tour_date: e.target.value
                  })
                }
              />
            )}

            <input
              type="text"
              placeholder="Website"
              value={newApartment.website}
              onChange={(e) =>
                setNewApartment({
                  ...newApartment,
                  website: e.target.value
                })
              }
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