import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
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

    const [formData, setFormData] = useState({ ...initialFormState });
    const [reservationError, setReservationError] = useState(null);

    const displayReservation = (date) => {
        setUpdateTrigger(!updateTrigger);
        history.push(`/dashboard?date=${date}`);
    }

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Input\n", formData.first_name, formData.last_name, formData.mobile_number, 
            formData.reservation_date, formData.reservation_time, formData.people);
        const reservationData = {
            data : {
                'first_name' : formData.first_name,
                'last_name' : formData.last_name,
                'mobile_number' : formData.mobile_number,
                'reservation_date' : formData.reservation_date,
                'reservation_time' : formData.reservation_time,
                'people' : Number.parseInt(formData.people)
            }
        };
        postReservation(reservationData)
            .then(displayReservation(reservationData.data.reservation_date))
            .catch(setReservationError);
    }

    return (
        <>
            <ErrorAlert error={reservationError} />
            <h1>New Reservation</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name:
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        onChange={handleChange}
                        value={formData.first_name}
                        required
                    />
                </label>
                <label htmlFor="last_name">
                    Last Name:
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        value={formData.last_name}
                        required
                    />
                </label>
                <label htmlFor="mobile_number">
                    Mobile Number:
                    <input
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        onChange={handleChange}
                        value={formData.mobile_number}
                        // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  // todo: uncomment this?
                        placeholder="###-###-####"
                        required
                    />
                </label>
                <label htmlFor="reservation_date">
                    Reservation Date:
                    <input 
                        id="reservation_date"
                        type="date"
                        name="reservation_date"
                        onChange={handleChange}
                        pattern="\d{4}-\d{2}-\d{2}"
                        placeholder="YYYY-MM-DD"
                        value={formData.reservation_date}
                        required
                    />
                </label>
                <label htmlFor="reservation_time">
                    Reservation Time: 
                    <input 
                        id="reservation_time"
                        type="time"
                        name="reservation_time"
                        onChange={handleChange}
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM"
                        value={formData.reservation_time}
                        required
                    />
                </label>
                <label htmlFor="people">
                    Number of People:
                    <input 
                        id="people"
                        type="number"
                        name="people"
                        min="1"
                        onChange={handleChange}
                        value={formData.people}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>

            <button type="button" onClick={() => history.goBack()}>Cancel</button>
        </>
    );
}

export default NewReservation;