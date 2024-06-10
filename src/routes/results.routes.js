const { Router } = require("express");
const ResultsController = require("../controllers/ResultsController");

const resultsRouter = Router();

const resultsController = new ResultsController();

resultsRouter.get("/:id", resultsController.index);
resultsRouter.get("/", resultsController.show);
resultsRouter.post("/", resultsController.create);
resultsRouter.put("/:id", resultsController.update);
resultsRouter.delete("/:id", resultsController.deleteOne);
resultsRouter.delete("/multiple/:ids", resultsController.deleteMany);

module.exports = resultsRouter;