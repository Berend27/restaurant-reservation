import React from "react";
import DashboardButtons from "./DashboardButtons";
import ErrorAlert from "../ErrorAlert";
import { next, previous, today } from "../../utils/date-time";
import ReservationsList from "../reservations/ReservationsList";

function DashboardContent({ day, setDay, reservations, reservationsError }) {

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

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsList reservations={reservations.data} />
      <DashboardButtons 
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleToday={handleToday}
      />
    </main>
  );
}

export default DashboardContent;