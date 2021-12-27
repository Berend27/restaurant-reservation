import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { postReservation } from "../../utils/api";
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
        if (reservationIsValid()) {
            postReservation(reservationData)
            .then(() => {
                displayReservation(reservationData.data.reservation_date);
            })
            .catch((error) => {
                setReservationError(error);
            });
        }
    }

    const reservationIsValid = () => {
        const dateString = reservation.reservation_date
        const timeString = reservation.reservation_time;
        const openingTimeString = "10:30";
        const lastHourString = "21:30";
        let errorString = "";
        if (dateString && timeString) {
            const dateAndTime = dateString + "T" + timeString + ":00";
            const date = new Date(dateAndTime);
            if (date.getDay() === 2) {
                errorString += `Tuesday reservations aren't allowed as the restaurant is closed on Tuesdays.\n`;
            }
            if (Date.now() > date.getTime()) {
                errorString += `The reservation date is in the past. Only future reservations are allowed.`;
            }
            if (!isEligibleTime(openingTimeString, lastHourString, date)) {
                errorString += `The reservation must be between ${openingTimeString} and ${lastHourString} inclusive`;
            }
            
            if (errorString) {
                const error = new Error(errorString);
                setReservationError(error);
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    const isEligibleTime = (firstString, lastString, date) => {
        // firstString and lastString in format of HH:MM
        const pattern = /[0-2][0-9]:[0-5][0-9]/;
        if (!pattern.test(firstString) || !pattern.test(lastString)) {
            throw new Error("firstString and lastString must both be of the format HH:MM");
        }
        const openingHour = Number.parseInt(firstString.slice(0, 2));
        const openingMinute = Number.parseInt(firstString.slice(3, 5));
        const openingDate = new Date(date);
        openingDate.setHours(openingHour);
        openingDate.setMinutes(openingMinute);
        const closingHour = Number.parseInt(lastString.slice(0, 2));
        const closingMinute = Number.parseInt(lastString.slice(3, 5));
        const closingDate = new Date(date);
        closingDate.setHours(closingHour);
        closingDate.setMinutes(closingMinute);
        return (date.getTime() <= closingDate.getTime() && date.getTime() >= openingDate.getTime());
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