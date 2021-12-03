import React from "react";

// todo: next, previous, and today
function DashboardButtons({ handleNext, handlePrevious, handleToday }) {
    return (
        <div>
            <button type="button" class="btn btn-dark mr-2" id="previous" onClick={handlePrevious}>Previous</button>
            <button type="button" class="btn btn-dark mr-2" id="next" onClick={handleNext}>Next</button>
            <button type="button" class="btn btn-dark mr-2" id="today" onClick={handleToday}>Today</button>
        </div>
    );
}

export default DashboardButtons;