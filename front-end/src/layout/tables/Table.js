import React from "react";

function Table({ table }) {
    const status = table.reservation_id ? "Occupied" : "Free"

    function displayModal() {
        
    }

    return (
        <div className="card bg-dark text-white">
            <div className="card-body">
                <h3>{table.table_name}</h3>
                <p>Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id}>{status}</p>
                <button className="btn-btn-primary" data-table-id-finish={table.table_id} onClick={() => displayModal}>Finish</button>
            </div>
        </div>
    );
}

export default Table;