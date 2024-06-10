const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require('../providers/DiskStorage');

class DepoimentsController {
  async index(request, response) {
    const { id } = request.params;
    
    const depoiment = await knex("depoiments").where({ id }).first();
    
    return response.status(201).json(depoiment)
  }

  async show(request, response) {    
    const depoiments = await knex("depoiments");

    if(!depoiments) {
      throw new AppError("Não há depoimentos cadastrado no sistema")
    }
    
    return response.status(201).json(depoiments)
  }
  
  async create(request, response) {
    const { author, text, role } = request.body;
    const img_url = request.file;

    let filename;

    if(img_url) {
      const diskStorage = new DiskStorage();
      filename = await diskStorage.saveFile(img_url.filename, "depoiment");
    }

    const depoiment = await knex("depoiments").insert({ 
      author,
      text,
      role,
      img_url: filename ?? null
    })

    return response.status(201).json({depoiment})
  }

  async update(request, response) {
    const { id } = request.params;
    const { author, text, role, updated_at } = request.body;
    const img_url = request.file;

    const diskStorage = new DiskStorage();    
    
    const depoiment = await knex("depoiments").where({ id }).first();

    if(!depoiment) {
      throw new AppError("Sistema não encontrado", 401)
    }

    depoiment.author = author ?? depoiment.author;
    depoiment.text = text ?? depoiment.text;
    depoiment.role = role ?? depoiment.role;
    depoiment.updated_at = updated_at;

    if(img_url) {
      if(depoiment.img_url) {
        await diskStorage.deleteFile(depoiment.img_url, "depoiment");
      }

      const filename = await diskStorage.saveFile(img_url.filename, "depoiment");
      depoiment.img_url = filename;
    }

    await knex("depoiments").where({ id }).update(depoiment);
    
    return response.status(201).json(depoiment)
  }

  async deleteOne(request, response) {
    const { id } = request.params;

    const depoiment = await knex("depoiments")
    .where({ id }).first();

    if(!depoiment) {
      throw new AppError("Não existe um depoimento com este id em nosso banco de dados")
    }
    // Deletar o arquivo da pasta
    if(depoiment.img_url) {
      const diskStorage = new DiskStorage();
      await diskStorage.deleteFile(depoiment.img_url, "depoiment");
    }

    await knex("depoiments").where({ id }).delete();

    return response.status(201).json({success: true})
  }

  async deleteMany(request, response) {
    const { ids } = request.params;
    const idsArray = ids.split(',').map(Number);

    if (!Array.isArray(idsArray) || idsArray.length === 0) {
      return response.status(400).json({ error: "Por favor, forneça um array de IDs válido." });
    }
  
    const depoiments = await knex("depoiments")
    .whereIn('id', idsArray)
    .select('img_url');
    
    // Deletar os arquivos da pasta
    const diskStorage = new DiskStorage();
    for (const depoiment of depoiments) {
      await diskStorage.deleteFile(depoiment.img_url, "depoiment");
    }

    const deletedDepoiments = await knex("depoiments")
      .whereIn('id', idsArray)
      .delete();

    if (deletedDepoiments === 0) {
      throw new AppError("Nenhum depoimento encontrado com os IDs fornecidos.");
    }
  
    return response.status(200).json({ success: true, deletedCount: deletedDepoiments });
  }
}

module.exports = DepoimentsController;