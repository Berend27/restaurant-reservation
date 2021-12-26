import React from "react";
import Reservation from "./Reservation";
import './ReservationsList.css';

function ReservationsList({ cancelReservation, reservations }) {
    if (reservations) {
        const items = reservations.map((reservation) => {
            return <li key={reservation.reservation_id}>
                <Reservation cancelReservation={cancelReservation} reservation={reservation} />
            </li>
        });
    
        return (
            <ul>{items}</ul>
        );
    }
    return null;
}

export default ReservationsList;