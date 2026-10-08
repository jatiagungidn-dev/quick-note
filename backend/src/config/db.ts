import Database from "better-sqlite3";
import { env } from "./env.js";

const db = new Database(env.DATABASE_PATH);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

export default db;
