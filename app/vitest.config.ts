import { defineConfig } from "vitest/config";
import { resolve } from "path";

// Tests run against their own SQLite file (prisma/test.db), never the preview DB.
export default defineConfig({
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: { DATABASE_URL: "file:./test.db" },
    globalSetup: ["./vitest.global-setup.ts"],
  },
});
