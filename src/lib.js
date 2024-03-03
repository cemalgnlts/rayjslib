import raylibWASM from "../build/raylib.wasm";
import Module from "../build/raylib.js";

async function setupRaylib({ canvas }) {
  const module = await Module({
    canvas,
    wasmBinary: raylibWASM
  });

  return module;
}

export { setupRaylib };
