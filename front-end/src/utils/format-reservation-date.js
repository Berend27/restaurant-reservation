import { formatAsDate } from "./date-time";

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
