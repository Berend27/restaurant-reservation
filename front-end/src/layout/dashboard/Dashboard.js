import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import NotFound from "../NotFound";
import { getReservationsForDay } from "../../utils/api";
import { useLocation } from "react-router-dom";
import DashboardContent from "./DashboardContent";
import { today } from "../../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const location = useLocation();

  const [day, setDay] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(getDayFromQuery, [location]);
  useEffect(loadDashboard, [day, updateTrigger]);

  function getDayFromQuery() {
    if (location.search.includes("date=")) {
      const newDateIndex = location.search.indexOf("date=") + 5;
      if (newDateIndex > 4 && newDateIndex <= location.search.length - 10) {
        setDay(location.search.slice(newDateIndex, newDateIndex + 10));
        location.search = "";
      }
    }
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    // listReservations({ date }, abortController.signal)
    //   .then(setReservations)
    //   .catch(setReservationsError);
    getReservationsForDay(day)
      .then((data) => {
        setReservations(data)
      })
      .catch(setReservationsError);
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
        <NewReservation updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
      </Route>
      <Route path="/tables/new">
        <NewTable updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
      </Route>
      <Route path="/dashboard">
        <DashboardContent 
          day={day}
          setDay={setDay} 
          reservations={reservations} 
          reservationsError={reservationsError} 
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Dashboard;
