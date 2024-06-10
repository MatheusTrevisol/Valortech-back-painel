const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require('../providers/DiskStorage');

class SystemsController {
  async index(request, response) {
    const { id } = request.params;
    
    const system = await knex("systems").where({ id }).first();
    
    return response.status(201).json(system)
  }

  async show(request, response) {    
    const systems = await knex("systems");

    if(!systems) {
      throw new AppError("Não há sistemas cadastrado no sistema")
    }
    
    return response.status(201).json(systems)
  }
  
  async create(request, response) {
    const { name } = request.body;
    const img_url = request.file;

    if (!name) {
      throw new AppError("O nome é obrigatório");
    }

    if (!img_url) {
      throw new AppError("Imagem é obrigatória");
    }

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(img_url.filename, "system");
    
    const system = await knex("systems").insert({ 
      name,
      img_url: filename
    })

    return response.status(201).json({system})
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, updated_at } = request.body;
    const img_url = request.file;

    const diskStorage = new DiskStorage();    
    
    const system = await knex("systems").where({ id }).first();

    if(!system) {
      throw new AppError("Sistema não encontrado", 401)
    }

    system.name = name ?? system.name;
    system.updated_at = updated_at;

    if(img_url) {
      await diskStorage.deleteFile(system.img_url, "system");

      const filename = await diskStorage.saveFile(img_url.filename, "system");
      system.img_url = filename;
    }

    await knex("systems").where({ id }).update(system);
    
    return response.status(201).json(system)
  }

  async deleteOne(request, response) {
    const { id } = request.params;

    const system = await knex("systems")
    .where({ id }).first();

    if(!system) {
      throw new AppError("Não existe um sistema com este id em nosso banco de dados")
    }
    // Deletar o arquivo da pasta
    if(!system.img_url) {
      const diskStorage = new DiskStorage();
      await diskStorage.deleteFile(system.img_url, "system");
    }

    await knex("systems").where({ id }).delete();

    return response.status(201).json({success: true})
  }

  async deleteMany(request, response) {
    const { ids } = request.params;
    const idsArray = ids.split(',').map(Number);

    if (!Array.isArray(idsArray) || idsArray.length === 0) {
      return response.status(400).json({ error: "Por favor, forneça um array de IDs válido." });
    }
  
    const systems = await knex("systems")
    .whereIn('id', idsArray)
    .select('img_url');
    
    // Deletar os arquivos da pasta
    const diskStorage = new DiskStorage();
    for (const system of systems) {
      await diskStorage.deleteFile(system.img_url, "system");
    }

    const deletedSystems = await knex("systems")
      .whereIn('id', idsArray)
      .delete();

    if (deletedSystems === 0) {
      throw new AppError("Nenhum sistema encontrado com os IDs fornecidos.");
    }
  
    return response.status(200).json({ success: true, deletedCount: deletedSystems });
  }
}

module.exports = SystemsController;