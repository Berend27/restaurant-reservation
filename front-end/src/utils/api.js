/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const axios = require("axios");

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
// todo: use or delete this
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export function cancelReservation(reservationId) {
  return axios 
    .put(`${API_BASE_URL}/reservations/${reservationId}/status`,
      { data: { status: "cancelled" }}
    )
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
    });
}

export function deleteAssignment(table_id) {
  return axios
    .delete(`${API_BASE_URL}/tables/${table_id}/seat`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
    });
}

export function getReservation(id) {
  return axios 
    .get(`${API_BASE_URL}/reservations/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export function getReservationsForDay(date) {
  return axios
    .get(`${API_BASE_URL}/reservations?date=${date}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.message)
    });
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
// todo: delete this?
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function listTables() {
  return axios 
    .get(`${API_BASE_URL}/tables`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.message);
    })
}

export async function postReservation(reservationData) {
  return axios
    .post(`${API_BASE_URL}/reservations/new`, reservationData)
    .catch((error) => {
      error.message = error.response.data.error
      throw error;
    });
}

export function postTable(tableData) {
  return axios
    .post(`${API_BASE_URL}/tables`, tableData)
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
    });
}

export function putReservation(data, reservationId) {
  return axios
    .put(`${API_BASE_URL}/reservations/${reservationId}`, data)
    .catch(error => {
      error.message = error.response.data.error;
      throw error;
    });
}

export function putTable(data, tableId) {
  return axios 
    .put(`${API_BASE_URL}/tables/${tableId}/seat`, data)
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
    });
}

export function searchForMobileNumber(mobileNumber) {
  return axios 
    .get(`${API_BASE_URL}/reservations?mobile_number=${mobileNumber}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      error.message = error.response.data.error;
      throw error;
    })
}