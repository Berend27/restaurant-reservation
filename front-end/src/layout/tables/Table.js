import React from "react";

function Table({ table, deleteSeating }) {
    const status = table.reservation_id ? "Occupied" : "Free"

    let finishButton = null;

    const displayConfirm = async () => {
        document.getElementById(`finish`).blur();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            await deleteSeating(table);
        }
    }

    if (status === "Occupied") {
        finishButton = <button 
                            className="btn btn-danger" 
                            data-table-id-finish={table.table_id} 
                            id="finish" 
                            onClick={displayConfirm}
                        >
            Finish
        </button>;
    }

    return (
        <div className="card bg-dark text-white">
            <div className="card-body">
                <h3>{table.table_name}</h3>
                <p>Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id}>{status}</p>
                {finishButton}
            </div>
        </div>
    );
}

export default Table;