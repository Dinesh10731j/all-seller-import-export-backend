"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "eagle_heli12",
    database: "all_nepal_import_export",
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=psqlDb.config.js.map