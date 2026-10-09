import db from "../src/config/db";
import fs from "node:fs";
import path from "node:path";
import { afterAll, beforeAll } from "vitest";

const migrattionsDir = path.join(process.cwd(), "src/database/migrations");

const files = fs
  .readdirSync(migrattionsDir)
  .filter((file) => file.endsWith("sql"))
  .sort();

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrattionsDir, file), "utf-8");

  db.exec(sql);
}

beforeAll(() => {
  db.exec("DELETE FROM notes");
});

afterAll(() => {
  db.close();
});
