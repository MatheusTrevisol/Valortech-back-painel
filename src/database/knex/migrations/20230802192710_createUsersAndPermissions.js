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

   // CREATE PERMISSIONS TABLE
   await knex.schema.createTable("permissions", async (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();;
  });

  // INSERT PERMISSIONS
  await knex("permissions").insert([
    { id: 1, name: "ADMIN" },
  ]);

  /* CREATE ADMIN*/
  const hashedAdminPassword = await hash("IDN24", 8);

  await knex("users").insert({
    name: "IDN",
    email: "idn@admin.com",
    password: hashedAdminPassword,
    permission_id: 1
  });
};

exports.down = knex => knex.schema.dropTable("users");