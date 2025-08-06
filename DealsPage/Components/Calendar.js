import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function WDGCalendar() {
  const [events, setEvents] = useState([]);

  // In a real application, you would fetch events from an API or Google Calendar API
  useEffect(() => {
    setEvents([
      {
        title: 'Meeting with Team',
        start: new Date(2025, 7, 6, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
        end: new Date(2025, 7, 6, 11, 0),
      },
      {
        title: 'Project Deadline',
        start: new Date(2025, 7, 8, 14, 0),
        end: new Date(2025, 7, 8, 16, 0),
      },
    ]);
  }, []);

  return (
    <div style={{ height: "calc(100vh - 60px)" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="day" // or "week", "month", "day", "agenda"
        style={{ margin: '5px' }}
      />
    </div>
  );
}

export default WDGCalendar;