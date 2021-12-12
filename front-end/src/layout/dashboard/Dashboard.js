import React, { useEffect, useState } from "react";
import DashboardContent from "./DashboardContent";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import NotFound from "../NotFound";
import useQuery from "../../utils/useQuery";
import { Redirect, Route, Switch } from "react-router-dom";
import { getReservationsForDay } from "../../utils/api";
import { today } from "../../utils/date-time";
import { useLocation } from "react-router-dom";

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

  useEffect(getDayFromQuery, [location, queryParameters]);
  useEffect(loadDashboard, [day, updateTrigger]);

  function getDayFromQuery() {
    if (queryParameters.has('date')) {
      setDay(queryParameters.get('date'));
      location.search="";
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
