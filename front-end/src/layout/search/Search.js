import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import { searchForMobileNumber } from "../../utils/api";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const filteredNumber = filterPhoneNumber(mobileNumber);
    try {
      const results = await searchForMobileNumber(filteredNumber);
      setReservations(results.data);
      setSearchDone(true);
    } catch (error) {
      setSearchError(error);
    }
  };

  const filterPhoneNumber = (numberString) => {
    const chars = numberString.split("");
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const filtered = chars.filter((char) => numbers.includes(char));
    return filtered.join("");
  };

  let noResultsText = searchDone ? "No reservations found" : "";

  let resultElement =
    reservations.length > 0 ? (
      <ReservationsList reservations={reservations} />
    ) : (
      <p>{noResultsText}</p>
    );

  return (
    <div>
      <ErrorAlert error={searchError} />
      <h1>Search</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
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
          <div className="col-md-6 mb-3">
            <button type="submit" className="btn btn-primary w-50">
              Find
            </button>
          </div>
        </div>
      </form>
      {resultElement}
    </div>
  );
}

export default Search;
