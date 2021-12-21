const knex = require("../db/connection");
const reservationsController = require("../reservations/reservations.controller");
const reservationsService = require("../reservations/reservations.service");
const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// Validation
// todo: Validation for criterion 5 of story 4
const REQUIRED_PROPERTIES = [
    'table_name',
    'capacity',
];

const VALID_PROPERTIES = [
    ...REQUIRED_PROPERTIES,
    'reservation_id',
    'table_id',
    'created_at',
    'updated_at',
];

const capacityIsAdequate = (req, res, next) => {
  const reservation = res.locals.reservation; 
  const table = res.locals.table;
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Insufficient table capacity for this reservation`
    });
  }
  next();
}

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

const hasData = (req, res, next) => {
  if (!('data' in req.body)) {
    return next({
      status: 400,
      message: `The request is missing a 'data' property.`
    });
  }
  next();
};

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

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES)

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

const reservationExists = async (req, res, next) => {
  const { data = {} } = req.body;
  const reservation_id = data.reservation_id;
  if (reservation_id) {
    const reservation = await reservationsService.read(reservation_id);
    if (reservation) {
      res.locals.reservation = reservation;
      return next();
    }
    return next({
      status: 404,
      message: `The reservation_id ${reservation_id} does not exist.`
    });
  }
  next({
    status: 400,
    message: `The request is missing a 'reservation_id' property.` 
  });
}

const reservationNotSeated = async (req, res, next) => {
  const reservation = res.locals.reservation;
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: `this reservation is already seated`,
    });
  }
  next();
}

const tableExists = (req, res, next) => {
  const id = req.params.table_id;
  tablesService
    .read(id)
    .then((table) => {
      if (table) {
        res.locals.table = table;
        return next();
      }
      next({ status: 404, message: `Table with table_id ${id} not found` });
    })
    .catch(next);
}

const tableIsFree = (req, res, next) => {
  const table = res.locals.table;
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: `This table is currently occupied.`,
    });
  }
  next();
}

const tableIsOccupied = (req, res, next) => {
  const table = res.locals.table;
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: `This table is currently not occupied.`,
    });
  }
  next();
}

const tableNameIsMoreThanOneCharacter = (req, res, next) => {
  const { data = {} } = req.body;
  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name must be atleast two characters`
    });
  }
  next();
}

// Route Handlers

async function create(req, res) {
    const data = await tablesService 
        .create(req.body.data);
        res.status(201).json({ data });
}

async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data });
}

async function updateToSeat(req, res, next) {
  const reservation = res.locals.reservation;
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  const data = await tablesService.update(updatedTable);
  reservation.status = "seated"
  await reservationsService.update(reservation);
  res.status(200).json({ data });
}

async function updateToDeleteAssignment(req, res) {
  // await knex.transaction(async (trx) => {
    const reservation = res.locals.reservation;
    reservation.status = "finished";
    const updatedTable = {
      ...res.locals.table,
      reservation_id: null,
      table_id: res.locals.table.table_id,
    };
    await tablesService.update(updatedTable);
    await reservationsService.update(reservation);
  // })
  res.sendStatus(200);
}

module.exports = {
  
    create: [
        hasData,
        hasRequiredProperties,
        hasOnlyValidProperties,
        propertiesAreOfCorrectType,
        capacityIsAtleast1,
        tableNameIsMoreThanOneCharacter,
        asyncErrorBoundary(create)
    ],
    list: asyncErrorBoundary(list),
    updateToSeat: [
      hasData,
      asyncErrorBoundary(tableExists),
      reservationExists,
      reservationNotSeated,
      capacityIsAdequate,
      capacityIsAtleast1,
      tableIsFree,
      asyncErrorBoundary(updateToSeat)
    ],
    updateToDeleteAssignment: [
      asyncErrorBoundary(tableExists),
      tableIsOccupied,
      reservationExists,
      asyncErrorBoundary(updateToDeleteAssignment)
    ],
};