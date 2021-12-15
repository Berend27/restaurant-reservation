import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { getReservation } from "../../utils/api";
import { useHistory, useParams } from "react-router-dom";

function NewSeating({ tables }) {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [selectedIdString, setSelected] = useState("");
    const [seatingError, setSeatingError] = useState(null);

    const checkCapacity = async (capacity) => {
        const { data: reservation } = await getReservation(reservation_id);
        const people = reservation.people;
        console.log(people);
        return people <= capacity;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // const capacityIndex = selected.lastIndexOf("-") + 2;
        // if (capacityIndex > 1 && selected.length > 2) {
        //     const capacity = Number.parseInt(selected.slice(capacityIndex));
        // }
        // console.log("selected");
        // console.log(typeof selectedIdString);
        // console.log(selectedIdString);
        const table = tables.find((table) => table.table_id === Number.parseInt(selectedIdString));
        if (table && await checkCapacity(table.capacity)) {
            console.log("reservation is valid")
        } else {
            console.log("capacity exceeded");
        }
    }

    const handleTableChange = (event) => { 
        const selectedIndex = event.target.options.selectedIndex;
        setSelected(event.target.options[selectedIndex].getAttribute('table_id'))
    };

    if (tables) {
        if (tables.length > 0 && !selectedIdString) {
            setSelected(tables[0].table_id)
        }
        const options = tables.map((table) => {
            return <option key={table.table_id} table_id={table.table_id}>{table.table_name} - {table.capacity}</option>
        });
    
        return (
            <div>
                <ErrorAlert error={seatingError} />
                <h1>New Seating</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="table_id" >Table Number</label>
                        <select 
                            className="form-control" 
                            id="table_id"
                            name="table_id"
                            onChange={handleTableChange}
                            required>
                                {options}
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-secondary">Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
    else {
        setSeatingError(new Error("There are no tables."));
        return (
            <>
                <ErrorAlert error={seatingError} />
            </>
        );
    }
}

export default NewSeating;