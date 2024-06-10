exports.up = async (knex) => {
  await knex.schema.createTable("systems", async (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("img_url");
  
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  })
};

exports.down = knex => knex.schema.dropTable("systems");