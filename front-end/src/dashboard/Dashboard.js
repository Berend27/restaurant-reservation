import React, { useEffect, useState } from "react";
import { getReservationsForDay, listReservations } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardButtons from "./DashboardButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [day, setDay] = useState(date);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [day]);

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
    getReservationsForDay(day)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <DashboardButtons 
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleToday={handleToday}
      />
    </main>
  );
}

export default Dashboard;
