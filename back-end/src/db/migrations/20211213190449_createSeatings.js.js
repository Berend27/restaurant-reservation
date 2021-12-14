
exports.up = function(knex) {
    return knex.schema.createTable("seatings", (seating) => {
        seating.increments("seating_id").primary();
        seating.boolean("is_seated").defaultTo(false).notNullable();
        seating.integer("reservation_id").unsigned().notNullable();
        seating
        .foreign("reservation_id")
        .references("reservation_id")
        .inTable("reservations")
        .onDelete("cascade");
        seating.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("seatings");
};
