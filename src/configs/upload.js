const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const UPLOAD_FOLDER = path.resolve(__dirname, "..", "..", "uploads");
const UPLOAD_AVATAR_FOLDER = path.resolve(UPLOAD_FOLDER, "avatar");
const UPLOAD_SYSTEMS_FOLDER = path.resolve(UPLOAD_FOLDER, "systems");
const UPLOAD_DEPOIMENTS_FOLDER = path.resolve(UPLOAD_FOLDER, "depoiments");

const MULTER = {
  storage: multer.diskStorage({
    destination: UPLOAD_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex")  // (formato hexadecimal);
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName);
    }
  })
}

module.exports = {
  UPLOAD_FOLDER,
  UPLOAD_AVATAR_FOLDER,
  UPLOAD_SYSTEMS_FOLDER,
  UPLOAD_DEPOIMENTS_FOLDER,
  MULTER
}