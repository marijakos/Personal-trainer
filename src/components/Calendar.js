import React, { useEffect, useState } from 'react';
import { Calendar,  momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';


const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })


function MyCalendar()  {

    const [trainings, setTrainings] = useState([]);
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        getTrainings()
      }, []);

    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTrainings(data.map((training) => (
            {
              title: training.activity + "/" + training.customer.firstname + " " + training.customer.lastname,
              start: moment.utc(training.date)._d,
              end: moment.utc(training.date).add(trainings.duration, 'minutes')._d,

            }
        ))))
        .catch(err => console.error(err))

    }

    /*const events = trainings.map((training) =>
        training =
        {

          title: training.activity,
          start: moment(training.date).toDate(),
          end: moment(training.date).add(training.duration, 'minutes').toDate(),
          resource: training.customer.firstname
        }
    );
    console.log('events:', events);*/



    return (
        <Calendar
            localizer={localizer}
            events={trainings}
            views={['month', 'week', 'day', 'agenda']}
            step={60}
            showMultiDayTimes
            resourceTitleAccessor='resource'
            startAccessor='start'
            endAccessor='end'
            components={{
                timeSlotWrapper: ColoredDateCellWrapper,
              }}
            style={{ height: 800, paddingTop: 30 }}
        />
    )
}

export default MyCalendar;