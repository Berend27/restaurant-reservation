import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { postReservation } from "../../utils/api";
import { reservationIsValid } from "../../utils/validation";
import { useHistory } from "react-router-dom";

function NewReservation({ updateTrigger, setUpdateTrigger }) {

    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }

    const [reservation, setReservation] = useState({ ...initialFormState });
    const [reservationError, setReservationError] = useState(null);

    const displayReservation = (date) => {
        setUpdateTrigger(!updateTrigger);
        history.push(`/dashboard?date=${date}`);
    }
    const handleCancel = () => {
        history.goBack();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const reservationData = {
            data : {
                'first_name' : reservation.first_name,
                'last_name' : reservation.last_name,
                'mobile_number' : reservation.mobile_number,
                'reservation_date' : reservation.reservation_date,
                'reservation_time' : reservation.reservation_time,
                'people' : Number.parseInt(reservation.people)
            }
        };
        if (reservationIsValid(reservation, setReservationError)) {
            postReservation(reservationData)
            .then(() => {
                displayReservation(reservationData.data.reservation_date);
            })
            .catch((error) => {
                setReservationError(error);
            });
        }
    }

    return (
        <>
            <ErrorAlert error={reservationError} />
            <h1>New Reservation</h1>
            <ReservationForm 
                reservation={reservation} 
                setReservation={setReservation} 
                handleCancel={handleCancel} 
                handleSubmit={handleSubmit} 
            />
        </>
    );
}

export default NewReservation;