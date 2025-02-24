import "./DashboardContent.css";
import React from "react";
import DashboardButtons from "./DashboardButtons";
import ErrorAlert from "../ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import { next, previous, today } from "../../utils/date-time";
import { putYearLast } from "../../utils/format-reservation-date";


function DashboardContent({ cancelReservation, day, deleteSeating, setDay, reservations = [], reservationsError, tables = [], tablesError }) { 
  const handleNext = () => {
    setDay(next(day));
    document.getElementById("next").blur();
  }

  const handlePrevious = () => {
    setDay(previous(day));
    document.getElementById("previous").blur();
  }

  const handleToday = () => {
    setDay(today());
    document.getElementById("today").blur();
  }

  if (!day) {
    setDay(today);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="row" >
        <div className="col-md-6" >
          <div className="mb-3 column-header">
            <h4 className="mb-0 centered">Reservations for {putYearLast(day)}</h4>
          </div>
          <ReservationsList cancelReservation={cancelReservation} reservations={reservations} />
          <DashboardButtons 
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleToday={handleToday}
          />
        </div>
        <div className="col-md-6" >
          <TablesList tables={tables} deleteSeating={deleteSeating} />
        </div>
      </div>
    </main>
  );
}

export default DashboardContent;