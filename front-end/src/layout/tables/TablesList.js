import "./TablesList.css";
import React from "react";
import Table from "./Table";

function TablesList({ tables }) {
    if (tables) {
        const items = tables.map((table) => {
            return <li key={table.table_id}><Table table={table} /></li>
        });

        return (
            <div>
                {/* todo: Maybe move this div with the h4 back to DashboardContent */}
                <div className="mb-3">
                    <h4 className="mb-0 centered">Tables</h4>
                </div>
                <ul>{items}</ul>
            </div>
        );
    }
    return null;
}

export default TablesList;