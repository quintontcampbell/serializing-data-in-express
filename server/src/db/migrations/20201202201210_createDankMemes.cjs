/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("dankMemes", (table) => {
    table.bigIncrements("id").primary()
    table.string("name").notNullable()
    table.string("url").notNullable()
    table.bigInteger("launcherId").unsigned().index().references("launchers.id")
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  })
}

/**
* @param {Knex} knex
*/
exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("dankMemes")
}
