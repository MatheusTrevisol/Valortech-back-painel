exports.up = async (knex) => {
  await knex.schema.createTable("banners", async (table) => {
    table.increments("id").primary();
    table.string("title");
    table.string("text");
    table.string("video_url");
  
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  })
};

exports.down = knex => knex.schema.dropTable("banners");