const knex = require("../database/knex")
const authConfig = require("../configs/auth");
const AppError = require("../utils/AppError");

const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;
    const user = await knex("users").where({email}).first();

    if(!user) {
      throw new AppError("Email e/ou senha incorreta.", 401);
    }

    const passwordMatch = compare(password, user.password);

    if(!passwordMatch) {
      throw new AppError("Email e/ou senha incorreta.", 401);
    }
    console.log(authConfig.jwt)
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return response.status(201).json({
      user,
      token
    })
  }
}

module.exports = SessionsController;