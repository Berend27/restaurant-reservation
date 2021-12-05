import React from "react";
import DashboardButtons from "./DashboardButtons";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../layout/reservations/ReservationsList";

function DashboardComponent({ handleNext, handlePrevious, handleToday, reservations, reservationsError }) {
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

export default DashboardComponent;