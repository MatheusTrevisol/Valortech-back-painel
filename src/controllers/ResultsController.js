const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class ResultsController {
  async index(request, response) {
    const { id } = request.params;
    
    const result = await knex("results").where({ id }).first();
    
    return response.status(201).json(result)
  }

  async show(request, response) {    
    const results = await knex("results");

    if(!results) {
      throw new AppError("Não há resultados cadastrado no sistema")
    }
    
    return response.status(201).json(results)
  }
  
  async create(request, response) {
    const { title, text } = request.body;

    const result = await knex("results").insert({ 
      title,
      text
    })

    return response.status(201).json({result})
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, text, updated_at } = request.body;
    
    const result = await knex("results").where({ id }).first();

    if(!result) {
      throw new AppError("Resultado não encontrado", 401)
    }

    result.title = title ?? result.title;
    result.text = text ?? result.text;
    result.updated_at = updated_at;

    await knex("results").where({ id }).update(result);
    
    return response.status(201).json(result)
  }

  async deleteOne(request, response) {
    const { id } = request.params;

    const result = await knex("results")
    .where({ id }).first();

    if(!result) {
      throw new AppError("Não existe um resultado com este id em nosso banco de dados")
    }

    await knex("results").where({ id }).delete();

    return response.status(201).json({success: true})
  }

  async deleteMany(request, response) {
    const { ids } = request.params;
    const idsArray = ids.split(',').map(Number);

    if (!Array.isArray(idsArray) || idsArray.length === 0) {
      return response.status(400).json({ error: "Por favor, forneça um array de IDs válido." });
    }  

    const deletedResults = await knex("results")
      .whereIn('id', idsArray)
      .delete();

    if (deletedResults === 0) {
      throw new AppError("Nenhum resultado encontrado com os IDs fornecidos.");
    }
  
    return response.status(200).json({ success: true, deletedCount: deletedResults });
  }
}

module.exports = ResultsController;