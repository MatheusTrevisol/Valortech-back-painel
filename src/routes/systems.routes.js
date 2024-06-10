const { Router } = require("express");
const SystemsController = require("../controllers/SystemsController");

const systemsRouter = Router();

const systemsController = new SystemsController();

const multer = require("multer");
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

systemsRouter.get("/:id", systemsController.index);
systemsRouter.get("/", systemsController.show);
systemsRouter.post("/",  upload.single("system"), systemsController.create);
systemsRouter.put("/:id",  upload.single("system"), systemsController.update);
systemsRouter.delete("/:id", systemsController.deleteOne);
systemsRouter.delete("/multiple/:ids", systemsController.deleteMany);

module.exports = systemsRouter;