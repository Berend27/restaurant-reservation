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

async function create(req, res, next) {
  const data = await service 
    .create(req.body.data);
    res.status(201).json({ data });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  console.log(req.query);
  let date = req.query.date;
  if (!date) {
    console.log(date)
    date = today();
  }
  const data = await service.listForDate(date);
  res.json({ data });
}

module.exports = {
  create: [hasOnlyValidProperties, hasRequiredProperties, propertiesAreOfCorrectType, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
