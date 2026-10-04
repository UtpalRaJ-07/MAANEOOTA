import { execSync } from "child_process";
import { rmSync } from "fs";
import { join } from "path";

// Recreate and seed the isolated test database before every run.
export default function setup() {
  const cwd = process.cwd();
  const env = { ...process.env, DATABASE_URL: "file:./test.db" };
  for (const f of ["test.db", "test.db-journal"]) rmSync(join(cwd, "prisma", f), { force: true });
  execSync("npx prisma db push --skip-generate", { cwd, env, stdio: "pipe" });
  execSync("npx tsx prisma/seed.ts", { cwd, env, stdio: "pipe" });
}
