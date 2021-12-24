import React from "react";
import "./Reservation.css";
import { putYearLast } from "../../utils/format-reservation-date";
import { toStandardTime } from "../../utils/format-reservation-time";

function Reservation({ reservation }) {
    const status = reservation.status ? reservation.status : "booked"

    let seatButton = status === "booked" ? (
        <a href={`/reservations/${reservation.reservation_id}/seat`}> 
            <button type="button" className="btn btn-primary">Seat</button>
        </a>
    ) : null;

    return (
        <div className="card bg-dark text-white">
            <div className="card-body">
                <h2>Reservation {reservation.reservation_id}</h2>
                <h3>Name</h3>
                <p>{reservation.first_name} {reservation.last_name}</p>
                <h3>Mobile Number</h3>
                <p>{reservation.mobile_number}</p>
                <h3>Time &amp; Date</h3>
                <p>{toStandardTime(reservation.reservation_time)} on {putYearLast(reservation.reservation_date)}</p>
                <h3>Status</h3>
                <p data-reservation-id-status={reservation.reservation_id}>{status}</p>
                {seatButton}
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                    <button type="button" className="btn btn-secondary">Edit</button>
                </a>
            </div>
        </div>
    );
}

export default Reservation;