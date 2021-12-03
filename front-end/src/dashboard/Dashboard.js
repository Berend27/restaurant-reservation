import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardButtons from "./DashboardButtons";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
// todo: is the default value necessary i.e. = new Date()
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  const handleNext = () => {
    console.log("Next pressed");
    document.getElementById("next").blur();
  }

  const handlePrevious = () => {
    console.log("Previous pressed");
    document.getElementById("previous").blur();
  }

  const handleToday = () => {
    console.log("Today pressed");
    document.getElementById("today").blur();
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
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
