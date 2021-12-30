// form component for creating a new table

import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import { postTable } from "../../utils/api";
import { useHistory } from "react-router-dom";

function NewTable({ updateTrigger, setUpdateTrigger }) {

    const history = useHistory();

    const initialFormState = {
        table_name: "",
        capacity: 0,
    }

    const [formData, setFormData] = useState({ ...initialFormState });
    const [tableError, setTableError] = useState(null);

    const goToUpdatedDashboard = () => {
        setUpdateTrigger(!updateTrigger);
        history.push(`/dashboard`);
    }

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const tableData = {
            data : {
                'table_name' : formData.table_name,
                'capacity' : Number.parseInt(formData.capacity),
            }
        };
        if (tableIsValid(tableData.data)) {
            postTable(tableData)
            .then(() => {
                goToUpdatedDashboard();
            })
            .catch((error) => {
                setTableError(error);
            });
        }
    }

    const tableIsValid = (table) => {
        let errorString = "";
        if (table.table_name.length < 2) {
            errorString += "Table Name must be atleast two characters long.";
        }
        if (!table.capacity || table.capacity < 1) {
            errorString += "A table must have a capacity of at least 1 person.";
        }
        if (errorString) {
            const error = new Error(errorString);
            setTableError(error);
            return false;
        } else {
            return true;
        }
    }

    return (
        <div>
            <ErrorAlert error={tableError} />
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group d-flex justify-content-end col-md-6">
                        <div className="col-lg-9 px-0">
                            <label htmlFor="table_name">Table Name</label>
                            <input 
                                className="form-control"
                                id="table_name"
                                type="text"
                                name="table_name"
                                onChange={handleChange}
                                value={formData.table_name}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group d-flex justify-content-start col-md-6">
                        <div className="col-lg-9 px-0">
                            <label htmlFor="capacity">Capacity</label>
                            <input 
                                className="form-control"
                                id="capacity"
                                type="number"
                                name="capacity"
                                min="1"
                                onChange={handleChange}
                                value={formData.capacity}
                                required
                            />
                            </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 d-flex justify-content-end pr-md-1">
                        <div className="col-lg-9 px-0">
                            <button type="submit" className="btn btn-primary w-100 mt-2">Submit</button>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-start pl-md-1">
                        <div className="col-lg-9 px-0">
                            <button type="button" className="btn btn-primary w-100 mt-2" onClick={() => history.goBack()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NewTable;