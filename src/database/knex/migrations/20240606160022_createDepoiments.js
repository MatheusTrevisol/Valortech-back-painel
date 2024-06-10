exports.up = async (knex) => {
  await knex.schema.createTable("depoiments", async (table) => {
    table.increments("id").primary();
    table.string("author");
    table.string("text");
    table.string("img_url")
    ;
    table.string("role");
  
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  })
};

exports.down = knex => knex.schema.dropTable("depoiments");