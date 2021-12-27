import React, { useEffect, useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { getReservation } from "../../utils/api";
import { useParams } from "react-router-dom";

function EditReservation() {

    const [editingError, setEditingError] = useState(null);
    const [reservation, setReservation] = useState({});

    const { reservation_id } = useParams();

    // todo: make a boolean for this?
    let statusMessage = reservation.status === 'booked' ? 
        null :
        <p>Only reservations with a status of 'booked' can be edited.</p>;

    const loadReservation = () => {
        const abortController = new AbortController();
        getReservation(reservation_id)
            .then((response) => {
                setReservation(response.data);
            })
            .catch(setEditingError);
        return () => abortController.abort();
    }

    useEffect(loadReservation, [reservation_id]);

    return (
        <>
            <ErrorAlert error={editingError} />
            {statusMessage}
        </>
    );
}

export default EditReservation;