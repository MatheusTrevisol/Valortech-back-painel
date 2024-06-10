const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file, type) {
    switch (type) {
      case "avatar":
        await fs.promises.rename(
          path.resolve(uploadConfig.UPLOAD_FOLDER, file),
          path.resolve(uploadConfig.UPLOAD_AVATAR_FOLDER, file),
        );
        break
      case "system":
        await fs.promises.rename(
          path.resolve(uploadConfig.UPLOAD_FOLDER, file),
          path.resolve(uploadConfig.UPLOAD_SYSTEMS_FOLDER, file),
        );
        break
      case "depoiment":
        await fs.promises.rename(
          path.resolve(uploadConfig.UPLOAD_FOLDER, file),
          path.resolve(uploadConfig.UPLOAD_DEPOIMENTS_FOLDER, file),
        );
        break;
      default:
        break;
    }

    return file;
  };

  async deleteFile(file, type) {
    let filePath;

    switch (type) {
      case "avatar":
        filePath = path.resolve(uploadConfig.UPLOAD_AVATAR_FOLDER, file);

        break;
      case "system":
        filePath = path.resolve(uploadConfig.UPLOAD_SYSTEMS_FOLDER, file);

        break
      case "depoiment":
        filePath = path.resolve(uploadConfig.UPLOAD_DEPOIMENTS_FOLDER, file);

        break;
      default:
        break;
    }

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    return fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;