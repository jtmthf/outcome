import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/option.ts", "src/result.ts", "src/task.ts"],
  target: "node18",
  format: ["cjs", "esm"],
  clean: true,
  sourcemap: true,
  dts: true,
});
