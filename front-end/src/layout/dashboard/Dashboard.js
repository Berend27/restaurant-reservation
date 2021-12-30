import React, { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import EditReservation from "../reservations/EditReservation";
import NewReservation from "../reservations/NewReservation";
import NewSeating from "../reservations/NewSeating";
import NewTable from "../tables/NewTable";
import NotFound from "../NotFound";
import useQuery from "../../utils/useQuery";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  cancelReservation,
  deleteAssignment,
  getReservationsForDay,
  listTables,
} from "../../utils/api";
import { today } from "../../utils/date-time";
import { useLocation } from "react-router-dom";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const location = useLocation();
  const queryParameters = useQuery();

  const [day, setDay] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(getDayFromQuery, [location, queryParameters]);
  useEffect(loadDashboard, [day, updateTrigger]);

  const cancelTheReservation = async (reservation_id) => {
    try {
      await cancelReservation(reservation_id);
      setUpdateTrigger(!updateTrigger);
    } catch (error) {
      setReservationsError(error);
    }
  };

  const deleteSeating = (table) => {
    deleteAssignment(table.table_id)
      .then((response) => {
        setUpdateTrigger(!updateTrigger);
      })
      .catch((error) => {
        setTablesError(error);
      });
  };

  function getDayFromQuery() {
    if (queryParameters.has("date")) {
      setDay(queryParameters.get("date"));
      location.search = "";
    }
  }

  function loadDashboard() {
    const abortController = new AbortController();
    async function fetchData() {
      setReservationsError(null);
      try {
        const response = await getReservationsForDay(day);
        setReservations(response.data);
        setTablesError(null);
        try {
          const tablesResponse = await listTables();
          if (tablesResponse.data) {
            setTables(tablesResponse.data);
          }
        } catch (errorWithTables) {
          setTablesError(errorWithTables);
        }
      } catch (error) {
        setReservationsError(error);
      }
    }
    fetchData();
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <NewSeating
          tables={tables}
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </Route>
      <Route path="/tables/new">
        <NewTable
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
        />
      </Route>
      <Route path="/dashboard">
        <DashboardContent
          cancelReservation={cancelTheReservation}
          day={day}
          deleteSeating={deleteSeating}
          setDay={setDay}
          reservations={reservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          tables={tables}
          tablesError={tablesError}
        />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Dashboard;
