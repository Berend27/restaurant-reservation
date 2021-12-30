/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 const API_BASE_URL =
 process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const axios = require("axios");

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

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
      error.message = error.response.data.error;
      throw error;
    });
}

export function getReservationsForDay(date) {
  return axios
    .get(`${API_BASE_URL}/reservations?date=${date}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
    });
}

export async function listTables() {
  return axios 
    .get(`${API_BASE_URL}/tables`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.message = error.response.data.error;
      throw error;
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