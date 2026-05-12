import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { supabase } from '../supabaseClient';

import './ApartmentDetails.css';


const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [tourDateInput, setTourDateInput] = useState('');
  
  const [apartment, setApartment] = useState(null);
 const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState('');

  const [status, setStatus] = useState(apartment?.status || '');

  const fetchApartment = useCallback(async () => {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching apartment:', error);
    setLoading(false);
    return;
  }

  setApartment(data);
  setStatus(data.status);
  setLoading(false);
}, [id]);

useEffect(() => {
  fetchApartment();
}, [fetchApartment]);

const handleStatusChange = async (e) => {
  const updatedStatus = e.target.value;

  if (updatedStatus === 'Scheduled') {
    setStatus(updatedStatus);
    setShowModal(true);
    return;
  }

  setStatus(updatedStatus);

  const { error } = await supabase
    .from('apartments')
    .update({
      status: updatedStatus,
      tour_date: null
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return;
  }

  fetchApartment();
};

const handleSaveTourDate = async () => {
  if (!tourDateInput) return;

  const { error } = await supabase
    .from('apartments')
    .update({
      status: 'Scheduled',
      tour_date: tourDateInput
    })
    .eq('id', id);

  if (error) {
    console.error('Error saving tour date:', error);
    return;
  }

  setShowModal(false);
  fetchApartment();
};

const handleDeleteApartment = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this apartment?');
  if (!confirmed) return;

  const { error } = await supabase
    .from('apartments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting apartment:', error);
    return;
  }

  navigate('/');
};

if (loading) {
  return <h1>Loading...</h1>;
}

if (!apartment) {
  return <h1>Apartment Not Found</h1>;
}

// Google Maps
const mapUrl = apartment.address
  ? `https://www.google.com/maps?q=${encodeURIComponent(apartment.address)}&output=embed`
  : null;



  return (
        <div className="details-container">
            <h1 className="details-title">
                {apartment.name}
            </h1>

            <select
                className={`status-dropdown ${status.toLowerCase()}`}
                value={status}
                onChange={handleStatusChange}
            >
                <option value="Emailed">
                    Emailed
                </option>

                <option value="Scheduled">
                    Scheduled
                </option>

                <option value="Applied">
                    Applied
                </option>
            </select>

            {apartment.status === 'Scheduled' && (
                <div className="tour-section">
                    <h2>Tour Scheduled For:</h2>
                    <p>
  {apartment.tour_date
    ? new Date(apartment.tour_date).toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Not set yet'}
</p>
                </div>
            )}

            {mapUrl && (
  <div className="map-container">
    <iframe
      title="Apartment Map"
      src={mapUrl}
      width="100%"
      height="300"
      style={{ border: 0, borderRadius: "22px" }}
      loading="lazy"
      allowFullScreen
    />
  </div>
)}

            <div className="details-section">
                <h2>Address:</h2>

                <p>{apartment.address}</p>
            </div>

            <div className="website-section">
                <a
                    href={apartment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit Website
                </a>
            </div>

            <div className="delete-section">
                <button
                    className="delete-button"
                    onClick={handleDeleteApartment}
                >
                    Delete Apartment
                </button>
            </div>

            <div className="details-actions">
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                >
                    ← Back to Homepage
                </button>
            </div>
            {showModal && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h2>Schedule Tour</h2>

      <p>Select a date for your tour:</p>

      <input
  type="datetime-local"
  value={tourDateInput}
  onChange={(e) => setTourDateInput(e.target.value)}
/>

      <div className="modal-actions">
        <button className="modal-cancel" onClick={() => setShowModal(false)}>
          Cancel
        </button>

        <button className="modal-save" onClick={handleSaveTourDate}>
          Save
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
};

export default ApartmentDetails;