import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import mySelectBoxMemory from "./SelectBoxMemory";

export default class SpritePaletteTile {

    public spriteDataString: string;
    public spriteDiv: HTMLElement;

    constructor(
        sprite: string
    ) {
        let img = document.createElement('img');

        this.spriteDiv = img

        this.spriteDataString = sprite

        img.src = `${this.spriteDataString}`;

        img.addEventListener('click', () => {

            // multi tile fill

            if (mySelectBoxMemory.selectedArr.length != 0) {
                mySelectBoxMemory.selectedArr.forEach(element => {
                    element.style.backgroundImage = `url(${this.spriteDataString})`
                    element.style.border = '0'
                });
            }

            // single tile fill

            else if (mySpriteCanvasMemory.selectedCanvasTile != undefined) {
                mySpriteCanvasMemory.selectedCanvasTile.style.backgroundImage = `url(${this.spriteDataString})`
            }
        })
    }
}
