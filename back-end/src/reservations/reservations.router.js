/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const controller = require("./reservations.controller");
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

module.exports = router;
