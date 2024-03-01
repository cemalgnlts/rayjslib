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

function allocateStack(arrayBuffer) {
  const byteSize = arrayBuffer.length * arrayBuffer.BYTES_PER_ELEMENT;
  const address = module.stackAlloc(byteSize);
  module.writeArrayToMemory(arrayBuffer, address);

  return address;
}

function Color({ r = 0, g = 0, b = 0, a = 255 }) {
  const ui8 = new Uint8ClampedArray([r, g, b, a]);

  return allocateStack(ui8);
}

function initExtras() {
  // https://www.raylib.com/cheatsheet/cheatsheet.html
  Color.LIGHTGRAY = Color({ r: 200, g: 200, b: 200 }); // Light Gray
  Color.GRAY = Color({ r: 130, g: 130, b: 130 }); // Gray
  Color.DARKGRAY = Color({ r: 80, g: 80, b: 80 }); // Dark Gray
  Color.YELLOW = Color({ r: 253, g: 249, b: 0 }); // Yellow
  Color.GOLD = Color({ r: 255, g: 203, b: 0 }); // Gold
  Color.ORANGE = Color({ r: 255, g: 161, b: 0 }); // Orange
  Color.PINK = Color({ r: 255, g: 109, b: 194 }); // Pink
  Color.RED = Color({ r: 230, g: 41, b: 55 }); // Red
  Color.MAROON = Color({ r: 190, g: 33, b: 55 }); // Maroon
  Color.GREEN = Color({ r: 0, g: 228, b: 48 }); // Green
  Color.LIME = Color({ r: 0, g: 158, b: 47 }); // Lime
  Color.DARKGREEN = Color({ r: 0, g: 117, b: 44 }); // Dark Green
  Color.SKYBLUE = Color({ r: 102, g: 191, b: 255 }); // Sky Blue
  Color.BLUE = Color({ r: 0, g: 121, b: 241 }); // Blue
  Color.DARKBLUE = Color({ r: 0, g: 82, b: 172 }); // Dark Blue
  Color.PURPLE = Color({ r: 200, g: 122, b: 255 }); // Purple
  Color.VIOLET = Color({ r: 135, g: 60, b: 190 }); // Violet
  Color.DARKPURPLE = Color({ r: 112, g: 31, b: 126 }); // Dark Purple
  Color.BEIGE = Color({ r: 211, g: 176, b: 131 }); // Beige
  Color.BROWN = Color({ r: 127, g: 106, b: 79 }); // Brown
  Color.DARKBROWN = Color({ r: 76, g: 63, b: 47 }); // Dark Brown

  Color.WHITE = Color({ r: 255, g: 255, b: 255 }); // White
  Color.BLACK = Color({ r: 0, g: 0, b: 0 }); // Black
  Color.BLANK = Color({ r: 0, g: 0, b: 0, a: 0 }); // Blank (Transparent)
  Color.MAGENTA = Color({ r: 255, g: 0, b: 255 }); // Magenta
  Color.RAYWHITE = Color({ r: 245, g: 245, b: 245 }); // My own White (raylib logo)
}

export { setupRaylib, Color };
