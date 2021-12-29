const isEligibleTime = (firstString, lastString, date) => {
    // firstString and lastString in format of HH:MM
    const pattern = /[0-2][0-9]:[0-5][0-9]/;
    if (!pattern.test(firstString) || !pattern.test(lastString)) {
        throw new Error("firstString and lastString must both be of the format HH:MM");
    }
    const openingHour = Number.parseInt(firstString.slice(0, 2));
    const openingMinute = Number.parseInt(firstString.slice(3, 5));
    const openingDate = new Date(date);
    openingDate.setHours(openingHour);
    openingDate.setMinutes(openingMinute);
    const closingHour = Number.parseInt(lastString.slice(0, 2));
    const closingMinute = Number.parseInt(lastString.slice(3, 5));
    const closingDate = new Date(date);
    closingDate.setHours(closingHour);
    closingDate.setMinutes(closingMinute);
    return (date.getTime() <= closingDate.getTime() && date.getTime() >= openingDate.getTime());
}

const reservationIsValid = (reservation, setReservationError) => {
    const dateString = reservation.reservation_date.slice(0, 10);
    const timeString = reservation.reservation_time.slice(0, 5);
    const openingTimeString = "10:30";
    const lastHourString = "21:30";
    let errorString = "";
    if (dateString && timeString) {
        const dateAndTime = dateString + "T" + timeString + ":00";
        const date = new Date(dateAndTime);
        if (date.getDay() === 2) {
            errorString += `Tuesday reservations aren't allowed as the restaurant is closed on Tuesdays.\n`;
        }
        if (Date.now() > date.getTime()) {
            errorString += `The reservation date is in the past. Only future reservations are allowed.`;
        }
        if (!isEligibleTime(openingTimeString, lastHourString, date)) {
            errorString += `The reservation must be between ${openingTimeString} and ${lastHourString} inclusive`;
        }
        
        if (errorString) {
            const error = new Error(errorString);
            setReservationError(error);
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export { reservationIsValid };