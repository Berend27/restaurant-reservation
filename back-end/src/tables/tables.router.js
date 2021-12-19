/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:table_id/seat")
    .delete(controller.updateToDeleteAssignment)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;