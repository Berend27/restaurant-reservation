const knex = require("../db/connection");

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function update(table) {
    return knex("tables")
        .select("*")
        .where({ table_id: table.table_id })
        .update(table, "*")
        .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
    create,
    list,
    read,
    update,
}