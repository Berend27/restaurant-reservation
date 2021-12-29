import React from "react";
import "./Reservation.css";
import { putYearLast } from "../../utils/format-reservation-date";
import { toStandardTime } from "../../utils/format-reservation-time";

function Reservation({ cancelReservation, reservation }) {
    
    const displayConfirm = async () => {
        document.getElementById(`cancel`).blur();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            await cancelReservation(reservation.reservation_id);
        }
    }

    const status = reservation.status ? reservation.status : "booked"

    let seatButton = status === "booked" ? (
        <a href={`/reservations/${reservation.reservation_id}/seat`} className=" btn btn-primary d-inline-block flex-grow-1 mr-2"> 
            Seat
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
                <div className="d-flex justify-content-between">
                    {seatButton}
                    <a href={`/reservations/${reservation.reservation_id}/edit`} className=" btn btn-secondary d-inline-block flex-grow-1 mr-2">
                        Edit
                    </a>
                    <button 
                        id="cancel"
                        type="button" 
                        className="btn btn-danger flex-grow-1 px-1"
                        data-reservation-id-cancel={reservation.reservation_id} 
                        onClick={displayConfirm}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reservation;