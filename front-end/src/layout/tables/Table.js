import React from "react";

function Table({ table }) {
    const status = table.reservation_id ? "Occupied" : "Free"

    return (
        <div className="card bg-dark text-white">
            <div className="card-body">
                <h3>{table.table_name}</h3>
                <p>Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id}>{status}</p>
            </div>
        </div>
    );
}

export default Table;