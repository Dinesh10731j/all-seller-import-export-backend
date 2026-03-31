"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./configs/app"));
const psqlDb_config_1 = require("./configs/psqlDb.config");
const env_config_1 = require("./configs/env.config");
const chalk_1 = __importDefault(require("chalk"));
const cors_1 = __importDefault(require("cors"));
const app = (0, app_1.default)();
const PORT = Number(env_config_1.envConfig.PORT) || 5000;
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "5433";
const dbName = process.env.DB_NAME || "eagle_heli";
const dbUser = process.env.DB_USER_NAME || "postgres";
const allowedOrigins = [
    'http://localhost:3000',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));
console.log(chalk_1.default.cyan(`DB target -> host=${dbHost} port=${dbPort} db=${dbName} user=${dbUser}`));
psqlDb_config_1.AppDataSource.initialize()
    .then(async () => {
    console.log(chalk_1.default.green("Database connected"));
    if (process.env.NODE_ENV !== "test" && process.env.RUN_MIGRATIONS !== "false") {
        await psqlDb_config_1.AppDataSource.runMigrations();
        console.log(chalk_1.default.green("Database migrations applied"));
    }
    app.listen(PORT, () => {
        console.log(chalk_1.default.blue(`Server running on http://localhost:${PORT}`));
    });
})
    .catch((err) => {
    console.error(chalk_1.default.red("Database connection failed"), err);
});
//# sourceMappingURL=index.js.map