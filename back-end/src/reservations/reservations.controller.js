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
  'created_at',
  'updated_at',
];

const dateIsValid = (req, res, next) => {
  const dateString = req.body.data.reservation_date;
  const timeString = req.body.data.reservation_time;
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
      return next({
        status: 400,
        message: errorString,
      });
    }
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

// Route Handlers

async function create(req, res) {
  const data = await service 
    .create(req.body.data);
    res.status(201).json({ data });
}

async function list(req, res) {
  let date = req.query.date;
  if (!date) {
    date = today();
  }
  const data = await service.listForDate(date);
  res.json({ data });
}

module.exports = {
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    propertiesAreOfCorrectType, 
    dateIsValid,
    asyncErrorBoundary(create)
  ],
  list: asyncErrorBoundary(list),
};