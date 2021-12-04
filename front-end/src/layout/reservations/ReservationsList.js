import React from "react";
import Reservation from "./Reservation";
import './ReservationsList.css';

function ReservationsList({ reservations }) {
    if (reservations) {
        const items = reservations.map((reservation, index) => {
            return <li><Reservation reservation={reservation} /></li>
        });
    
        return (
            <ul>{items}</ul>
        );
    }
    return null;
}

export default ReservationsList;