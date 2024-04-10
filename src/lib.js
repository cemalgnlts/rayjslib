import raylibWASM from "../build/raylib.wasm";
import RaylibModule from "../build/raylib.js";

async function setupRaylib({ canvas }) {
  const module = await RaylibModule({
    canvas,
    wasmBinary: raylibWASM
  });

  return module;
}

export { setupRaylib };
