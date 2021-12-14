import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";

import { useHistory } from "react-router-dom";

function NewSeating({ reservation, tables }) {
    const history = useHistory();

    const [selected, setSelected] = useState("");
    const [seatingError, setSeatingError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const capacityIndex = selected.lastIndexOf("-") + 2;
        if (capacityIndex > 1 && selected.length > 2) {
            const capacity = Number.parseInt(selected.slice(capacityIndex));
        }
    }

    const handleTableChange = (event) => setSelected(event.target.value);

    if (tables) {
        const options = tables.map((table) => {
            return <option key={table.table_id}>{table.table_name} - {table.capacity}</option>
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
                </form>
                <div>
                    <button type="submit" className="btn btn-secondary">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                </div>
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