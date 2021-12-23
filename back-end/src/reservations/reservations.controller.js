const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const isTime = require("../utils/isTime");
const today = require("../utils/today");

// Validation

const REQUIRED_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
];

const VALID_PROPERTIES = [
  ...REQUIRED_PROPERTIES,
  'reservation_id',
  'status',
  'created_at',
  'updated_at',
];

// todo: fix this now that reservation_date is of type date and reservation_time is now a time in the database
const dateIsValid = (req, res, next) => {
  const dateArray = req.body.data.reservation_date.split("-");
  const timeArray = req.body.data.reservation_time.split(":");
  const openingTimeString = "10:30";
  const lastHourString = "21:30";
  const year = Number(dateArray[0]);
  const month = Number(dateArray[1] - 1);
  const day = Number(dateArray[2].slice(0, 2));
  const hour = timeArray[0];
  const minute = timeArray[1];
  const timeString = timeArray[0] + ":" + timeArray[1];
  const date = new Date(year, month, day, hour, minute);
  let errorString = "";
  if (dateArray && timeArray) {
    if (date.getDay() === 2) {
      errorString += `Tuesday reservations aren't allowed as the restaurant is closed on Tuesdays.\n`;
    }
    if (Date.now() > date.getTime()) {
      errorString += `The reservation date is in the past. Only future reservations are allowed.`;
    }
    if (!isEligibleTime(openingTimeString, lastHourString, timeString)) {
      errorString += `The reservation must be between ${openingTimeString} and ${lastHourString} inclusive`;
  }
    if (errorString) {
      return next({
        status: 400,
        message: errorString,
      });
    }
  }
  next();
}

const hasPeople = (req, res, next) => {
  const { data = {} } = req.body;

  if (!data.people) {
    return next ({
      status: 400,
      message: `The value for people must be 1 or greater.`
    });
  }

  next();
}

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function hasValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status) {
    if (["booked", "seated", "finished"].includes(status)) {
      return next();
    }
    return next({
      status: 400,
      message: `unknown status value - the value for status must be either 'booked', 'seated', or 'finished'`,
    });
  }
  next({
    status: 400,
    message: `The value for status is missing.`,
  });
}

const isEligibleTime = (openingString, closingString, timeString) => {
  // firstString and lastString in format of HH:MM
  const pattern = /[0-2][0-9]:[0-5][0-9]/;
  if (!pattern.test(openingString) || !pattern.test(closingString)) {
      throw new Error("firstString and lastString must both be of the format HH:MM");
  }
  return (timeString >= openingString && timeString <= closingString);
  // const openingHour = Number.parseInt(firstString.slice(0, 2));
  // const openingMinute = Number.parseInt(firstString.slice(3, 5));
  // const openingDate = new Date(date);
  // openingDate.setHours(openingHour);
  // openingDate.setMinutes(openingMinute);
  // const closingHour = Number.parseInt(lastString.slice(0, 2));
  // const closingMinute = Number.parseInt(lastString.slice(3, 5));
  // const closingDate = new Date(date);
  // closingDate.setHours(closingHour);
  // closingDate.setMinutes(closingMinute);
  // return (date.getTime() <= closingDate.getTime() && date.getTime() >= openingDate.getTime());
}

function propertiesAreOfCorrectType(req, res, next) {
  const { data = {} } = req.body;
  
  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: `The value for 'people' must be a number.`,
    });
  }

  if (isNaN(new Date(data.reservation_date).getDate())) {
    return next({
      status: 400,
      message: `'reservation_date' must be a valid date in the correct format YYYY-MM-DD`,
    });
  }

  if (!isTime(data.reservation_time)) {
    return next({
      status: 400,
      message: `'reservation_time' must be a valid date in the correct format HH:MM`,
    });
  }

  next();
}

async function reservationExists(req, res, next) {
  const id = req.params.reservation_id;
  const reservation = await service.read(id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation with a reservation_id of ${id} not found` });
}

function statusIsBooked(req, res, next) {
  const status = req.body.data.status;
  if (status === "booked"  || !status) {
    return next();
  }
  next({
    status: 400,
    message: `The status is ${status}. The status for a new reservation must be booked.`,
  })
}

function statusIsNotFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `A finished status cannot be updated.`,
    });
  }
  next();
}

// Route Handlers

async function create(req, res) {
  const data = await service 
    .create(req.body.data);
    res.status(201).json({ data });
}

async function list(req, res) {
  let date = req.query.date;
  const number = req.query.mobile_number;
  if (number) {
    const data = await service.search(number);
    res.json({ data });
  } else {
    if (!date) {
      date = today();
    }
    const data = await service.listForDate(date);
    res.json({ data });
  }
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}

module.exports = {
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    propertiesAreOfCorrectType, 
    hasPeople,
    dateIsValid,
    statusIsBooked,
    asyncErrorBoundary(create)
  ],
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists), 
    read
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasValidStatus,
    statusIsNotFinished,
    update
  ],
};