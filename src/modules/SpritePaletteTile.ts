import myUserMemory from "./userData/UserMemory";
import mySpriteCanvasMemory from "./SpriteCanvasMemory";

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
            if (myUserMemory.selectedCanvasTileId != undefined) {
                mySpriteCanvasMemory.buttonsArray[myUserMemory.selectedCanvasTileId!].className = "spriteCanvasTile";
                mySpriteCanvasMemory.buttonsArray[myUserMemory.selectedCanvasTileId!].style.backgroundImage = `url(${this.spriteDataString})`
            } else {
                myUserMemory.currentDataString = this.spriteDataString
            }
        })
    }
}
