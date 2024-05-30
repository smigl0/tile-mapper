import SpriteCanvas from "./modules/SpriteCanvas.ts";
import SpriteSheet from "./modules/SpriteSheet.ts";
// import SpriteCanvas from "./modules/SpriteCanvas.ts"

/**
 *  Project index. To run you must create a canvas and link a spritesheed element.
 */

let testSheet = new SpriteSheet(document.querySelector('.aside')!);

// testSheet.loadImage('./src/img/SNES - Final Fantasy 6 - Zozo Tiles.png', 16, 16, 8)
testSheet.loadImage('./src/img/SNES - Final Fantasy 6 - Overworld tiles.png', 16, 33, 16)

new SpriteCanvas(testSheet, document.querySelector('#main')!, 20, 20)