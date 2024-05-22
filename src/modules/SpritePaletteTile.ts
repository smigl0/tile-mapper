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
            if (mySpriteCanvasMemory.selectedCanvasTileId != undefined) {
                mySpriteCanvasMemory.buttonsArray[mySpriteCanvasMemory.selectedCanvasTileId!].className = "spriteCanvasTile";
                mySpriteCanvasMemory.buttonsArray[mySpriteCanvasMemory.selectedCanvasTileId!].style.backgroundImage = `url(${this.spriteDataString})`

            }
        })
    }
}
