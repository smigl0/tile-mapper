import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import SpriteCanvas from "./SpriteCanvas";

export default class SpriteCanvasTile {

    public spriteDataString: string = '';
    public spriteDiv: HTMLElement;
    public id: number;

    constructor(spriteCanvas: SpriteCanvas, id: number, coordX: number, coordY: number) {

        this.id = id

        // adding the HTML element
        let button = document.createElement('button')
        button.id = `${coordX}-${coordY}`

        button.classList.add('spriteCanvasTile')

        button.addEventListener('click', () => {

            // reset selection methods

            spriteCanvas.resetSelection()

            // doubleclick to cancel

            if (mySpriteCanvasMemory.selectedCanvasTileId == id) {
                this.clearTileSelection()
            } else {

                mySpriteCanvasMemory.selectedCanvasTileId = id;

                button.className = "spriteCanvasTile spriteCanvasTileClicked"
                try { mySpriteCanvasMemory.buttonsArray[mySpriteCanvasMemory.selectedCanvasTileIdPrevious!].className = "spriteCanvasTile" } catch (error) { }

            }
        })

        button.addEventListener('mouseenter', (e) => {

            // selectbox Interaction
            if (spriteCanvas.mySelectBoxMemory.mouseDown) {
                spriteCanvas.mySelectBoxMemory.endTargetDiv = (e.target as HTMLElement)
                spriteCanvas.selectTiles(spriteCanvas.mySelectBoxMemory.initialTargetDiv!.id, (e.target as HTMLElement).id)
            }
        })

        this.spriteDiv = button
    }

    clearTileSelection() {
        this.spriteDiv.className = "spriteCanvasTile";
        mySpriteCanvasMemory.selectedCanvasTileIdPrevious = this.id
        mySpriteCanvasMemory.selectedCanvasTileId = undefined
    }
}