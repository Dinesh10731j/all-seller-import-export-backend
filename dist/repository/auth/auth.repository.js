"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_entity_1 = require("../../entities/user.entity");
const psqlDb_config_1 = require("../../configs/psqlDb.config");
class AuthRepository {
    constructor() {
        this.repo = psqlDb_config_1.AppDataSource.getRepository(user_entity_1.User);
    }
    // Create a new user (Signup)
    async createUser(userData) {
        const user = this.repo.create(userData); // create entity
        return this.repo.save(user); // save to DB
    }
    // Find a user by email (used for signup check or signin)
    async findByEmail(email) {
        return this.repo.findOneBy({ email });
    }
    async saveUser(user) {
        return this.repo.save(user);
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map