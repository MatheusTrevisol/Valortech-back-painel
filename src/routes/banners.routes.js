const { Router } = require("express");
const BannersController = require("../controllers/BannersController");

const bannersRouter = Router();

const bannersController = new BannersController();

const multer = require("multer");
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

bannersRouter.get("/:id", bannersController.index);
bannersRouter.get("/", bannersController.show);
bannersRouter.post("/",  upload.single("banner"), bannersController.create);
bannersRouter.put("/:id",  upload.single("banner"), bannersController.update);
bannersRouter.delete("/:id", bannersController.deleteOne);
bannersRouter.delete("/multiple/:ids", bannersController.deleteMany);

module.exports = bannersRouter;