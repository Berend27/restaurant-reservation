import React from "react";

function DashboardButtons({ handleNext, handlePrevious, handleToday }) {
    return (
        <div>
            <button type="button" className="btn btn-dark mr-2" id="previous" onClick={handlePrevious}>Previous</button>
            <button type="button" className="btn btn-dark mr-2" id="next" onClick={handleNext}>Next</button>
            <button type="button" className="btn btn-dark mr-2" id="today" onClick={handleToday}>Today</button>
        </div>
    );
}

export default DashboardButtons;