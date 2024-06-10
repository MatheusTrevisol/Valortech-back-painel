const { Router } = require("express");
const DepoimentsController = require("../controllers/DepoimentsController");

const depoimentsRouter = Router();

const depoimentsController = new DepoimentsController();

const multer = require("multer");
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

depoimentsRouter.get("/:id", depoimentsController.index);
depoimentsRouter.get("/", depoimentsController.show);
depoimentsRouter.post("/",  upload.single("depoiment"), depoimentsController.create);
depoimentsRouter.put("/:id",  upload.single("depoiment"), depoimentsController.update);
depoimentsRouter.delete("/:id", depoimentsController.deleteOne);
depoimentsRouter.delete("/multiple/:ids", depoimentsController.deleteMany);

module.exports = depoimentsRouter;