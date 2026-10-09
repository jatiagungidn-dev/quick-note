import Database from "better-sqlite3";
import { env } from "./env.js";

const databasePath =
  env.NODE_ENV === "test" ? "quicknote.test.db" : env.DATABASE_PATH;

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

export default db;
