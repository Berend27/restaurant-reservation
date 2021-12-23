import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";

function Search() {

    const [mobileNumber, setMobileNumber] = useState("");
    const [searchError, setSearchError] = useState(null);

    const handleChange = ({ target }) => {
        setMobileNumber(target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <div>
            <ErrorAlert error={searchError} />
            <h1>Search</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-9">
                        <input 
                            className="form-control"
                            id="mobile_number"
                            type="search"
                            name="mobile_number"
                            onChange={handleChange}
                            value={mobileNumber}
                            placeholder="Enter a customer's phone number"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Search;