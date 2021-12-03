const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

// Validation

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'created_at',
  'updated_at',
];

const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

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

// Route Handlers

// todo: error handling and use Postman to test if this works
async function create(req, res, next) {
  const data = await service 
    .create(req.body.data);
    res.status(201).json({ data });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const data = await service.listForDate(req.params.date);
  res.json({ data });
}

module.exports = {
  list,
};
