exports.up = async (knex) => {
  await knex.schema.createTable("results", async (table) => {
    table.increments("id").primary();
    table.string("title");
    table.string("text");
  
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  })
};

exports.down = knex => knex.schema.dropTable("results");