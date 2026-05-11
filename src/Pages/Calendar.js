import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = () => {
  const navigate = useNavigate();

  const [apartments, setApartments] = useState(() => {
    const saved = localStorage.getItem('apartments');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  const scheduledTours = apartments.filter(
    apt => apt.status === 'Scheduled' && apt.tourDate
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const changeMonth = (offset) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getToursForDay = (day) => {
    return scheduledTours.filter((apt) => {
      const date = new Date(apt.tourDate);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };

  const isToday = (day) => {
  if (!day) return false;

  const now = new Date();

  return (
    day === now.getDate() &&
    month === now.getMonth() &&
    year === now.getFullYear()
  );
};

  const days = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>‹</button>

        <h1>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h1>

        <button onClick={() => changeMonth(1)}>›</button>
      </div>

      <div className="calendar-grid responsive">
  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
    <div key={d} className="calendar-day-label">{d}</div>
  ))}

  {days.map((day, idx) => {
    if (!day) return <div key={idx} className="calendar-cell empty" />;

    const tours = getToursForDay(day);

    return (
      <div key={idx} className={`calendar-cell ${day && isToday(day) ? 'today' : ''}`}>
        <div className="calendar-date-row">
          <span className="calendar-date">{day}</span>

        </div>

        <div className="calendar-events">
          {tours.map(tour => (
            <div
              key={tour.id}
              className="calendar-event"
              onClick={() => navigate(`/apartment/${tour.id}`)}
            >
              <div className="event-name">{tour.name}</div>

              <div className="event-time">
                {new Date(tour.tourDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    
  })}
</div>

<div className="back-actions">
  <button
    className="back-button"
    onClick={() => navigate('/')}
  >
    ← Back to Homepage
  </button>
</div>
</div>
  );
};

export default Calendar;