import React, { useState } from "react";
import Modal from "../Modal";

function Table({ table, deleteSeating }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const status = table.reservation_id ? "Occupied" : "Free"

    let finishButton = null;

    const closeModal = () => {
        if (modalIsOpen) {
            setModalIsOpen(false);
        }
    }

    const displayModal = () => {
        setModalIsOpen(true);
    }

    const deleteAndClose = async () => {
        await deleteSeating(table);
        closeModal();
    }

    if (status === "Occupied") {
        finishButton = <button className="btn btn-danger" data-table-id-finish={table.table_id} onClick={displayModal}>Finish</button>;
    }

    return (
        <div className="card bg-dark text-white" onClick={closeModal}>
            <div className="card-body">
                <h3>{table.table_name}</h3>
                <p>Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id}>{status}</p>
                {finishButton}
            </div>
            <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)} onOk={deleteAndClose}>
                Is this table ready to seat new guests? This cannot be undone.
            </Modal>
        </div>
    );
}

export default Table;