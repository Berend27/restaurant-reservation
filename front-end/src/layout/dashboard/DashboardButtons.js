import React from "react";
import "./DashboardButtons.css";

function DashboardButtons({ handleNext, handlePrevious, handleToday }) {
  return (
    <div className="d-flex justify-content-between mb-4 mb-md-0">
      <button
        type="button"
        className="btn btn-dashboard flex-grow-1 mr-2"
        id="previous"
        onClick={handlePrevious}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-dashboard flex-grow-1 mr-1"
        id="next"
        onClick={handleNext}
      >
        Next
      </button>
      <button
        type="button"
        className="btn btn-dashboard flex-grow-1 ml-1"
        id="today"
        onClick={handleToday}
      >
        Today
      </button>
    </div>
  );
}

export default DashboardButtons;
