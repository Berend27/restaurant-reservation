import React from "react";
import { putYearLast } from "../../utils/format-reservation-date";
import { toStandardTime } from "../../utils/format-reservation-time";

function Reservation({ reservation }) {
    return (
        <div className="card">
            <div className="card-body">
                <h2>Reservation {reservation.reservation_id}</h2>
                <h3>Name</h3>
                <p>{reservation.first_name} {reservation.last_name}</p>
                <h3>Mobile Number</h3>
                <p>{reservation.mobile_number}</p>
                <h3>Time &amp; Date</h3>
                <p>{toStandardTime(reservation.reservation_time)} on {putYearLast(reservation.reservation_date)}</p>
            </div>
        </div>
    );
}

export default Reservation;