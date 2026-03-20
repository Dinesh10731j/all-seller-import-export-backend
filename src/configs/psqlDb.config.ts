import "reflect-metadata";
import { DataSource } from "typeorm";
export const AppDataSource = new DataSource({
   type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: "eagle_heli12",
  database: "all_nepal_import_export",
  synchronize: true,
  logging: false,
  entities: [
   
  ], 
  migrations: [],
  subscribers: [],
});
