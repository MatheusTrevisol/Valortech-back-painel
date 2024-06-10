const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");

const usersRouter = Router();

/** Middleware */
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

/** Avatar */
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.use(ensureAuthenticated);

usersRouter.get("/:id", usersController.index);
usersRouter.get("/", usersController.show);
usersRouter.post("/", usersController.create);
usersRouter.put("/", usersController.update);
usersRouter.patch("/avatar", upload.single("avatar"), userAvatarController.update);
usersRouter.delete("/:id", usersController.delete);

module.exports = usersRouter;