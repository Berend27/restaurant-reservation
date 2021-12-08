// import { formatAsDate } from "./date-time";
// const formatAsDate = require("./date-time").formatAsTime;

const dateFormat = /\d\d\d\d-\d\d-\d\d/;

function formatDate(reservation) {
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  return reservation;
}

export function putYearLast(date) {
  if (date.length === 10) {
    return date.slice(5).concat('-').concat(date.slice(0, 4));
  } 
  return date;
}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
 export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Formats the reservation_date property of a reservation.
 * @param reservations
 *  a single reservation, or an array of reservations.
 * @returns {[reservation]|reservation}
 *  the specified reservation(s) with the reservation_date property formatted as YYYY-MM-DD.
 */
export default function formatReservationDate(reservations) {
  return Array.isArray(reservations)
    ? reservations.map(formatDate)
    : formatDate(reservations);
}
