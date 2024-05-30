import mySelectBoxMemory from "./SelectBoxMemory";
import SpriteCanvas from "./SpriteCanvas";


/**
 * Single palette tile. Click on while another canvas tile is selected, to paint on.
 */
export default class SpritePaletteTile {

    public spriteDataString: string;
    public spriteDiv: HTMLDivElement;
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

            spriteCanvas.drawTiles(mySelectBoxMemory.selectedArr, sprite, true)

            if (mySelectBoxMemory.selectedArr.length == 1) {
                spriteCanvas.resetAllSelection()
                if(spriteCanvas.autoselectFlag){
                    spriteCanvas.autoSelect()
                }
            }
        })
    }
}
