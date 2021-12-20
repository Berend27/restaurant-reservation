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
        .where({ reservation_date })
        .orderBy("reservation_time");
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function update(reservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation.reservation_id })
        .update(reservation, "*")
        .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
    create,
    listForDate,
    read,
    search,
    update,
}