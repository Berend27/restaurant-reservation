import "./Reservation.css";
import React, { useEffect, useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { getReservation, putTable } from "../../utils/api";
import { useHistory, useParams } from "react-router-dom";

function NewSeating({ tables, updateTrigger, setUpdateTrigger }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [selectedIdString, setSelected] = useState("");
  const [seatingError, setSeatingError] = useState(null);

  const checkCapacity = async (capacity) => {
    const people = reservation.people;
    return people <= capacity;
  };

  const loadReservation = () => {
    const abortController = new AbortController();
    setSeatingError(null);
    getReservation(reservation_id)
      .then((response) => {
        setReservation(response.data);
      })
      .catch(setSeatingError);
    return () => abortController.abort();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const table = tables.find(
      (table) => table.table_id === Number.parseInt(selectedIdString)
    );
    if (table && (await checkCapacity(table.capacity))) {
      putTable({ data: { reservation_id: reservation_id } }, table.table_id)
        .then(() => {
          setUpdateTrigger(!updateTrigger);
          history.push("/dashboard");
        })
        .catch(setSeatingError);
    } else {
      setSeatingError(new Error(`Insufficient table capacity`));
    }
  };

  useEffect(loadReservation, [reservation_id]);

  const handleTableChange = (event) => {
    const selectedIndex = event.target.options.selectedIndex;
    setSelected(event.target.options[selectedIndex].getAttribute("table_id"));
  };

  if (tables) {
    if (tables.length > 0 && !selectedIdString) {
      setSelected(tables[0].table_id);
    }
    const options = tables.map((table) => {
      return (
        <option key={table.table_id} table_id={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });

    return (
      <div>
        <ErrorAlert error={seatingError} />
        <h1>New Seating</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="table_id">Table Number</label>
            <select
              className="form-control"
              id="table_id"
              name="table_id"
              onChange={handleTableChange}
              required
            >
              {options}
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-secondary mr-3">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    setSeatingError(new Error("There are no tables."));
    return (
      <>
        <ErrorAlert error={seatingError} />
      </>
    );
  }
}

export default NewSeating;
