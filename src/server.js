require("dotenv/config");

require('express-async-errors');

const uploadConfig = require("./configs/upload");

const AppError = require('./utils/AppError');
const express = require('express');

const app = express();

const routes = require("./routes");

const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));

app.use(routes);

const PORT = process.env.PORT || 3301;

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  } 

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));