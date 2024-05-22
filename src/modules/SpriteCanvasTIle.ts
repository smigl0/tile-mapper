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

            spriteCanvas.resetAllSelection()

            // doubleclick to cancel

            if (mySpriteCanvasMemory.selectedCanvasTile == button) {
                this.clearTileSelection()
            } else {

                mySpriteCanvasMemory.selectedCanvasTile = button;

                button.className = "spriteCanvasTile spriteCanvasTileClicked"

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
        mySpriteCanvasMemory.selectedCanvasTile = undefined
    }
}