import raylibWASM from "../build/raylib.wasm";
import Module from "../build/raylib.js";

let module;

async function setupRaylib({ canvas }) {
  module = await Module({
    canvas,
    wasmBinary: raylibWASM
  });

  initExtras();
  
  return module;
}

function makePointer(arrayBuffer) {
  const byteSize = arrayBuffer.length * arrayBuffer.BYTES_PER_ELEMENT;
  const address = module._malloc(byteSize);

  module.HEAPU8.set(arrayBuffer, address);

  return address;
}

function Color({ r = 0, g = 0, b = 0, a = 255 }) {
  const ui8 = new Uint8ClampedArray([r, g, b, a]);

  return makePointer(ui8);
}

function initExtras() {
  // https://www.raylib.com/cheatsheet/cheatsheet.html
  module.LIGHTGRAY = Color({ r: 200, g: 200, b: 200 }); // Light Gray
  module.GRAY = Color({ r: 130, g: 130, b: 130 }); // Gray
  module.DARKGRAY = Color({ r: 80, g: 80, b: 80 }); // Dark Gray
  module.YELLOW = Color({ r: 253, g: 249, b: 0 }); // Yellow
  module.GOLD = Color({ r: 255, g: 203, b: 0 }); // Gold
  module.ORANGE = Color({ r: 255, g: 161, b: 0 }); // Orange
  module.PINK = Color({ r: 255, g: 109, b: 194 }); // Pink
  module.RED = Color({ r: 230, g: 41, b: 55 }); // Red
  module.MAROON = Color({ r: 190, g: 33, b: 55 }); // Maroon
  module.GREEN = Color({ r: 0, g: 228, b: 48 }); // Green
  module.LIME = Color({ r: 0, g: 158, b: 47 }); // Lime
  module.DARKGREEN = Color({ r: 0, g: 117, b: 44 }); // Dark Green
  module.SKYBLUE = Color({ r: 102, g: 191, b: 255 }); // Sky Blue
  module.BLUE = Color({ r: 0, g: 121, b: 241 }); // Blue
  module.DARKBLUE = Color({ r: 0, g: 82, b: 172 }); // Dark Blue
  module.PURPLE = Color({ r: 200, g: 122, b: 255 }); // Purple
  module.VIOLET = Color({ r: 135, g: 60, b: 190 }); // Violet
  module.DARKPURPLE = Color({ r: 112, g: 31, b: 126 }); // Dark Purple
  module.BEIGE = Color({ r: 211, g: 176, b: 131 }); // Beige
  module.BROWN = Color({ r: 127, g: 106, b: 79 }); // Brown
  module.DARKBROWN = Color({ r: 76, g: 63, b: 47 }); // Dark Brown

  module.WHITE = Color({ r: 255, g: 255, b: 255 }); // White
  module.BLACK = Color({ r: 0, g: 0, b: 0 }); // Black
  module.BLANK = Color({ r: 0, g: 0, b: 0, a: 0 }); // Blank (Transparent)
  module.MAGENTA = Color({ r: 255, g: 0, b: 255 }); // Magenta
  module.RAYWHITE = Color({ r: 245, g: 245, b: 245 }); // My own White (raylib logo)
}

export { setupRaylib, makePointer, Color };
