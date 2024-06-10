const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const { hash, compare } = require("bcryptjs");

const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UsersController {
  async index(request, response) {
    const users = await knex("users");

    return response.status(201).json(users);
  };

  async show(request, response) {
    const { id } = request.params;

    const user = await knex("users").where({id}).first();

    return response.status(201).json(user);
  };

  async create(request, response) {
    const { name, email, password, confirmPassword } = request.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);
    await userCreateService.execute({ name, email, password, confirmPassword });

    return response.status(201).json();
  };

  async update(request, response) {
    const { name, email, old_password, password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Nenhum usuário encontrado.");
    }

    if(email) {
      const emailAlreadyExists = await knex("users").where({ email }).first();
  
      if(emailAlreadyExists && emailAlreadyExists.id !== user.id ) {
        throw new AppError("Este email já está sendo utilizado.");
      }
    }

    if(old_password && !password) {
      throw new AppError("Por favor informe a nova senha!");
    }

    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para alterar a senha.")
    }    

    if(password && old_password) {
      const comparePasswords = await compare(old_password, user.password);

      if(!comparePasswords) {
        throw new AppError("A senha antiga não confere")
      }
      user.password = await hash(password, 8);
    }
    
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await knex("users").update({
      name: user.name,
      password: user.password,
      email: user.email,
    }).where({ id: user_id });

    return response.json(user);
  };

  async delete(request, response) {
    const { id } = request.params;

    const deletedUser = await knex("users").where({ id }).delete();

    if(!deletedUser) {
      throw new AppError("Não existe um usuário com este id em nosso banco de dados")
    }

    return response.status(201).json({success: true})
  }
};

module.exports = UsersController;