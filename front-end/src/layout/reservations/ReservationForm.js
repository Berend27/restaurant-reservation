import React from "react";

function ReservationForm({ reservation, setReservation, handleCancel, handleSubmit }) {
    
    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.value,
        });
    };
    
    return (
        <>
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
                            value={reservation.first_name}
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
                            value={reservation.last_name}
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
                        value={reservation.reservation_date}
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
                        value={reservation.reservation_time}
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
                            value={reservation.people}
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
                            value={reservation.mobile_number}
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
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ReservationForm;