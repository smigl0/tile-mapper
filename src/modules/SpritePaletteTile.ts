import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import mySelectBoxMemory from "./SelectBoxMemory";
import SpriteCanvas from "./SpriteCanvas";

export default class SpritePaletteTile {

    public spriteDataString: string;
    public spriteDiv: HTMLElement;
    public spriteCanvas: (SpriteCanvas | undefined) = undefined;

    constructor(
        sprite: string,
        spriteCanvas: SpriteCanvas
    ) {
        let img = document.createElement('img');

        this.spriteDiv = img

        this.spriteDataString = sprite

        img.src = `${this.spriteDataString}`;

        img.addEventListener('click', () => {
            spriteCanvas.drawTiles(mySelectBoxMemory.selectedArr, sprite)
        })
    }
}
