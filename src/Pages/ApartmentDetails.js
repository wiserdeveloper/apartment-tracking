import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import apartments from '../Components/Apartments';

import './ApartmentDetails.css';


const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [apartmentsList, setApartmentsList] = useState(() => {
    const savedApartments = localStorage.getItem('apartments');

    return savedApartments
        ? JSON.parse(savedApartments)
        : apartments;
});

  const apartment = apartmentsList.find(apartment => apartment.id === parseInt(id));

  const [status, setStatus] = useState(apartment?.status || '');

  useEffect(() => {
    localStorage.setItem('apartments', JSON.stringify(apartmentsList));
}, [apartmentsList]);

const handleStatusChange = (e) => {
  const updatedStatus = e.target.value;
  setStatus(updatedStatus);
  const updatedApartments = apartmentsList.map((apt) =>
    apt.id === Number(id)
    ? { ...apt, status: updatedStatus }
    : apt
  );

  setApartmentsList(updatedApartments);
  };

  if (!apartment) {
    return <h1>Apartment Not Found</h1>;
}



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

            <div className="details-section">
                <h2>Address:</h2>

                <p>{apartment.address}</p>
            </div>

            <div className="map-placeholder">
                <h3>Google Map Coming Soon</h3>
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

            <button
                className="back-button"
                onClick={() => navigate('/')}
            >
                ← Back to Homepage
            </button>
        </div>
    );
};

export default ApartmentDetails;