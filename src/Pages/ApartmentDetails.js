import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import apartments from '../Components/Apartments';

import './ApartmentDetails.css';


const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [tourDateInput, setTourDateInput] = useState('');
  
  const [apartmentsList, setApartmentsList] = useState(() => {
    const savedApartments = localStorage.getItem('apartments');

    return savedApartments
        ? JSON.parse(savedApartments)
        : apartments;
});

  const apartment = apartmentsList.find(apartment => apartment.id === parseInt(id));

  const [status, setStatus] = useState(apartment?.status || '');
//   const [showTourModal, setShowTourModal] = useState(false);
//   const [tourDate, setTourDate] = useState('');
//   const [tourTime, setTourTime] = useState('');

  useEffect(() => {
    localStorage.setItem('apartments', JSON.stringify(apartmentsList));
}, [apartmentsList]);

const handleStatusChange = (e) => {
  const updatedStatus = e.target.value;

  // If switching to Scheduled → open modal instead of immediately saving
  if (updatedStatus === 'Scheduled') {
    setStatus(updatedStatus);
    setShowModal(true);
    return;
  }

  setStatus(updatedStatus);

  const updatedApartments = apartmentsList.map((apt) =>
    apt.id === Number(id)
      ? { 
          ...apt, 
          status: updatedStatus,
          tourDate: null // clear tour date if leaving scheduled
        }
      : apt
  );

  setApartmentsList(updatedApartments);
};

const handleSaveTourDate = () => {
  if (!tourDateInput) return;

  const updatedApartments = apartmentsList.map((apt) =>
    apt.id === Number(id)
      ? {
          ...apt,
          status: 'Scheduled',
          tourDate: tourDateInput
        }
      : apt
  );

  setApartmentsList(updatedApartments);
  setShowModal(false);
};

const handleDeleteApartment = () => {
  const confirmed = window.confirm('Are you sure you want to delete this apartment?');
  if (!confirmed) return;

  const updatedApartments = apartmentsList.filter((apt) => apt.id !== Number(id));
  setApartmentsList(updatedApartments);
  navigate('/');
};

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
  {apartment.tourDate
    ? new Date(apartment.tourDate).toLocaleString([], {
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