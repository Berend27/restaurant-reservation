import { formatAsTime } from "./date-time";

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
