import { build } from "esbuild";

console.time("Bundle");

await build({
  entryPoints: ["src/lib.js"],
  format: "esm",
  bundle: true,
  minify: true,
  outfile: "build/rayjslib.js",
  loader: {
    ".wasm": "binary"
  }
});

console.timeEnd("Bundle");