const knex = require("../db/connection");

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function listForDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date });
}

module.exports = {
    create,
    listForDate,
}