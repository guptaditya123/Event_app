import { build } from "esbuild";

build({
  entryPoints: ["app.js"], // your backend entry
  bundle: true,
  platform: "node",
  target: "node18", // or your Node version
  outfile: "dist/app.js",
  external: ["express", "mongoose"] // keep big deps external
}).catch(() => process.exit(1));
