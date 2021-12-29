import React, { useEffect, useState } from "react";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { getReservation, putReservation } from "../../utils/api";
import { reservationIsValid } from "../../utils/validation";
import { useHistory, useParams } from "react-router-dom";

function EditReservation({ updateTrigger, setUpdateTrigger }) {

    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        status: "",
        people: 1,
    }

    const [editingError, setEditingError] = useState(null);
    const [pageDate, setPageDate] = useState("");
    const [reservation, setReservation] = useState({ ...initialFormState });

    const { reservation_id } = useParams();

    let isBooked = reservation.status === 'booked'
    let statusMessage = isBooked ? 
        null :
        <p>Only reservations with a status of 'booked' can be edited.</p>;

    const loadReservation = () => {
        const abortController = new AbortController();
        getReservation(reservation_id)
            .then((response) => {
                setReservation(response.data);
                const date = response.data.reservation_date.slice(0, 10);
                if (date) {
                    setPageDate(date);
                }
            })
            .catch(setEditingError);
        return () => abortController.abort();
    }

    const displayPreviousPage = () => {
        setUpdateTrigger(!updateTrigger);
        if (pageDate) {
            history.push(`/dashboard?date=${pageDate}`);
        } else {
            history.goBack();
        }
    }

    const handleCancel = () => {
        if (pageDate) {
            history.push(`/dashboard?date=${pageDate}`);
        } else {
            history.goBack();
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        document.getElementById("submit").blur();
        if (isBooked) {
            const reservationData = {
                data : {
                    'first_name' : reservation.first_name,
                    'last_name' : reservation.last_name,
                    'mobile_number' : reservation.mobile_number,
                    'reservation_date' : reservation.reservation_date,
                    'reservation_time' : reservation.reservation_time.slice(0, 5),
                    'people' : Number.parseInt(reservation.people)
                }
            };
            if (reservationIsValid(reservation, setEditingError)) {
                putReservation(reservationData, reservation_id)
                .then(() => {
                    displayPreviousPage();
                })
                .catch((error) => {
                    setEditingError(error);
                });
            }
        } 
    }

    useEffect(loadReservation, [reservation_id]);

    return (
        <>
            <ErrorAlert error={editingError} />
            {statusMessage}
            <h1>Edit Reservation</h1>
            <ReservationForm 
                reservation={reservation} 
                setReservation={setReservation} 
                handleCancel={handleCancel} 
                handleSubmit={handleSubmit} 
            />
        </>
    );
}

export default EditReservation;