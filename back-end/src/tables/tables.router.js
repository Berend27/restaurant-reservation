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
    .all(methodNotAllowed);

router 
    .route("/new")
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:table_id/seat")
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;