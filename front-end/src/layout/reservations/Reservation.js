import React from "react";
import { toStandardTime } from "../../utils/format-reservation-time";

function Reservation({ reservation }) {
    return (
        <div>
            <h2>Reservation {reservation.reservation_id}</h2>
            <h3>Name</h3>
            <p>{reservation.first_name} {reservation.last_name}</p>
            <h3>Mobile Number</h3>
            <p>{reservation.mobile_number}</p>
            <h3>Time &amp; Date</h3>
            <p>{toStandardTime(reservation.reservation_time)} on {reservation.reservation_date}</p>
        </div>
    );
}

export default Reservation;