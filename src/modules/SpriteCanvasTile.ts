import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import SpriteCanvas from "./SpriteCanvas";
import mySelectBoxMemory from "./SelectBoxMemory";

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

            if (mySpriteCanvasMemory.selectedCanvasTile == button) {

                // doubleclick to cancel

                spriteCanvas.resetAllSelection()

            } else {

                // reset selection methods

                spriteCanvas.resetAllSelection()

                // since draw only uses myselectboxmemory, im writing to it the new button HTMLElement
                // this is only to avoid redundancy
                // (and wasting more time) :_@

                mySelectBoxMemory.selectedArr = [button]
                mySpriteCanvasMemory.selectedCanvasTile = button;
                mySpriteCanvasMemory.selectedId = this.id
                button.classList.add('spriteCanvasTileClicked')

            }
        })

        button.addEventListener('mouseenter', (e) => {
            // paste preview rendering
            if(spriteCanvas.pasteFlag){
                spriteCanvas.renderPasteTilePreview(this.spriteDiv.id)
            } 


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
