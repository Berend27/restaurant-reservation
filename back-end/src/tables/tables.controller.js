const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Validation

const REQUIRED_PROPERTIES = [
    'table_name',
    'capacity',
];

const VALID_PROPERTIES = [
    ...REQUIRED_PROPERTIES,
    'reservation_id',
    'table_id',
];

const capacityIsAtleast1 = (req, res, next) => {
    const { data = {} } = req.body;
    if (data.capacity < 1) {
        return next({
            status: 400,
            message: `The value for 'capacity' must be atleast 1.`,
          });
    }
    next();
}

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

const hasOnlyValidProperties = (req, res, next) => {
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

const propertiesAreOfCorrectType = (req, res, next) => {
    const { data = {} } = req.body;
    
    if (typeof data.capacity !== "number") {
      return next({
        status: 400,
        message: `The value for 'capacity' must be a number.`,
      });
    }

    next();
}

const tableExists = (req, res, next) => {
  service
    .read(req.params.table_id)
    .then((table) => {
      if (table) {
        res.locals.table = table;
        return next();
      }
      next({ status: 404, message: `Table not found` });
    })
    .catch(next);
}

// Route Handlers

async function create(req, res) {
    const data = await service 
        .create(req.body.data);
        res.status(201).json({ data });
}

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
}

async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
}

module.exports = {
    create: [
        hasOnlyValidProperties,
        hasRequiredProperties,
        propertiesAreOfCorrectType,
        capacityIsAtleast1,
        asyncErrorBoundary(create)
    ],
    list: asyncErrorBoundary(list),
    update: [
      asyncErrorBoundary(tableExists),
      asyncErrorBoundary(update)
    ],
};