const { Router } = require("express");

const usersRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const bannersRoutes = require("./banners.routes");
const systemsRouter = require("./systems.routes");
const resultsRouter = require("./results.routes");
const depoimentsRoutes = require("./depoiments.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/banners", bannersRoutes);
routes.use("/systems", systemsRouter);
routes.use("/results", resultsRouter);
routes.use("/depoiments", depoimentsRoutes);

module.exports = routes;