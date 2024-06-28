const { hash } = require('bcryptjs');

exports.up = async (knex) => {
  await knex.schema.createTable("users", async (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.varchar("email");
    table.text("password");
    table.integer("permission_id").references("id").inTable("permissions").default(2);
    table.text("avatar");
  
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
};

exports.down = knex => knex.schema.dropTable("users");