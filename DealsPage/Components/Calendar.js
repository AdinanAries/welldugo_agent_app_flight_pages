import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function WDGCalendar(props) {

  const {
    calendarEvents,
  } = props;

  const [events, setEvents] = useState([]);

  // In a real application, you would fetch events from an API or Google Calendar API
  useEffect(() => {
    setEvents(calendarEvents);
  }, []);

  return (
    <div style={{height: 1200}}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month" // or "week", "month", "day", "agenda"
        selectable
        onSelectEvent={(event) => alert(`${event.title} - From ${event.start} to ${event.end}`)}
        style={{ margin: '0' }}
      />
    </div>
  );
}

export default WDGCalendar;