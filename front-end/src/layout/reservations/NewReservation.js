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
        console.log(date);
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
        const dateString = formData.reservation_date
        const timeString = formData.reservation_time;
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
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            className="form-control"
                            id="first_name"
                            type="text"
                            name="first_name"
                            onChange={handleChange}
                            value={formData.first_name}
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            className="form-control"
                            id="last_name"
                            type="text"
                            name="last_name"
                            onChange={handleChange}
                            value={formData.last_name}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input 
                        className="form-control"
                        id="reservation_date"
                        type="date"
                        name="reservation_date"
                        onChange={handleChange}
                        pattern="\d{4}-\d{2}-\d{2}"
                        placeholder="YYYY-MM-DD"
                        value={formData.reservation_date}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reservation_time">Reservation Time</label>
                    <input 
                        className="form-control"
                        id="reservation_time"
                        type="time"
                        name="reservation_time"
                        onChange={handleChange}
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM"
                        value={formData.reservation_time}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="people">Number of People</label>
                        <input 
                            className="form-control"
                            id="people"
                            type="number"
                            name="people"
                            min="1"
                            onChange={handleChange}
                            value={formData.people}
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="mobile_number">Mobile Number</label>
                        <input
                            className="form-control"
                            id="mobile_number"
                            type="tel"
                            name="mobile_number"
                            onChange={handleChange}
                            value={formData.mobile_number}
                            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"  // todo: uncomment this?
                            placeholder="###-###-####"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="submit" className="btn btn-secondary">Submit</button>
                    </div>
                    <div className="col pl-0">
                        <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default NewReservation;