// import { formatAsTime } from "./date-time";
const timeFormat = /\d\d:\d\d/;

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

function formatTime(reservation) {
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  return reservation;
}

export function toStandardTime(militaryTime) {
  const [hours, minutes] = militaryTime.split(':');
  if (Number(hours) === 0) {
    return `12:${minutes} AM`;
  } else {
    return `${(hours > 12) ? hours - 12 : hours}:${minutes} ${(hours >= 12) ? 'PM' : 'AM'}`;
  }
}

/**
 * Formats the reservation_time property of a reservation.
 * @param reservations
 *  a single reservation, or an array of reservations.
 * @returns {[reservation]|reservation}
 *  the specified reservation(s) with the reservation_time property formatted as HH:MM.
 */
export default function formatReservationTime(reservations) {
  return Array.isArray(reservations)
    ? reservations.map(formatTime)
    : formatTime(reservations);
}
