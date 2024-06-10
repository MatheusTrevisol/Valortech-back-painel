const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require('../providers/DiskStorage');

class BannersController {
  async index(request, response) {
    const { id } = request.params;
    
    const banner = await knex("banners").where({ id }).first();
    
    return response.status(201).json(banner)
  }

  async show(request, response) {    
    const banners = await knex("banners");
    
    if(!banners) {
      throw new AppError("Não há Banners cadastrados no sistema")
    }

    return response.status(201).json(banners)
  }
  
  async create(request, response) {
    const { title, text, video_url } = request.body;

    const banner = await knex("banners").insert({ 
      title,
      text,
      video_url
    })

    return response.status(201).json({banner})
  }

  async update(request, response) {
    const { id } = request.params;
    const { title, text, video_url, updated_at } = request.body;
    
    const banner = await knex("banners").where({ id }).first();

    if(!banner) {
      throw new AppError("Banner não encontrado", 401)
    }

    banner.title = title ?? banner.title;
    banner.text = text ?? banner.text;
    banner.video_url = video_url ?? banner.video_url;
    banner.updated_at = updated_at;

    await knex("banners").where({ id }).update(banner);
    
    return response.status(201).json(banner)
  }

  async deleteOne(request, response) {
    const { id } = request.params;

    const banner = await knex("banners")
    .where({ id }).first();

    if(!banner) {
      throw new AppError("Não existe um banner com este id em nosso banco de dados")
    }

    await knex("banners").where({ id }).delete();

    return response.status(201).json({success: true})
  }

  async deleteMany(request, response) {
    const { ids } = request.params;
    const idsArray = ids.split(',').map(Number);

    if (!Array.isArray(idsArray) || idsArray.length === 0) {
      return response.status(400).json({ error: "Por favor, forneça um array de IDs válido." });
    }

    const deletedBanners = await knex("banners")
      .whereIn('id', idsArray)
      .delete();

    if (deletedBanners === 0) {
      throw new AppError("Nenhum banner encontrada com os IDs fornecidos.");
    }
  
    return response.status(200).json({ success: true, deletedCount: deletedBanners });
  }
}

module.exports = BannersController;