import React, { useEffect, useState } from "react";
import { getReservationsForDay } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import { useLocation } from "react-router-dom";
import DashboardComponent from "./DashboardComponent";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const location = useLocation();

  const [day, setDay] = useState(date);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [day, location]);

  const handleNext = () => {
    console.log("Next pressed");
    setDay(next(day));
    document.getElementById("next").blur();
  }

  const handlePrevious = () => {
    console.log("Previous pressed");
    setDay(previous(day));
    document.getElementById("previous").blur();
  }

  const handleToday = () => {
    console.log("Today pressed");
    setDay(today());
    document.getElementById("today").blur();
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // listReservations({ date }, abortController.signal)
    //   .then(setReservations)
    //   .catch(setReservationsError);
    if (location.search.length >= 15) {
      const newDateIndex = location.search.indexOf("date=") + 5;
      if (newDateIndex > 4 && newDateIndex <= location.search.length - 10) {
        setDay(location.search.slice(newDateIndex, newDateIndex + 10));
        location.search = "";
      }
    }
    getReservationsForDay(day)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <DashboardComponent 
      handleNext={handleNext} 
      handlePrevious={handlePrevious} 
      handleToday={handleToday} 
      reservations={reservations} 
      reservationsError={reservationsError} 
    />
  );
}

export default Dashboard;
