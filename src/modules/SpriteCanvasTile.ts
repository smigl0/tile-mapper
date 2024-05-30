import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import SpriteCanvas from "./SpriteCanvas";
import mySelectBoxMemory from "./SelectBoxMemory";


/**
 * Sprite canvas tile, used to paint on tiles.
 */
export default class SpriteCanvasTile {

    public spriteDataString: string = '';
    public spriteDiv: HTMLButtonElement;
    public id: number;

    constructor(spriteCanvas: SpriteCanvas, id: number, coordX: number, coordY: number) {

        this.id = id

        // adding the HTML element
        let button = document.createElement('button')
        button.id = `${coordX}-${coordY}`

        button.classList.add('spriteCanvasTile')

        button.addEventListener('click', (event) => {


            // let pastedFlag: boolean = false
            // reset pasteflag
            if (spriteCanvas.pasteFlag) {
                // pastedFlag = true
                spriteCanvas.pasteFlag = false

                spriteCanvas.pasteTilesDraw()

                // redraw paste so it adds itself to memory
            }


            if (mySpriteCanvasMemory.selectedCanvasTile == button || spriteCanvas.pasteFlag) {

                // doubleclick to cancel

                spriteCanvas.resetAllSelection()

            } else {
                if (event.shiftKey) {
                    if (!mySelectBoxMemory.selectedArr.includes(button)) {
                        mySelectBoxMemory.selectedArr.push(button)
                        button.classList.add('spriteCanvasTileSelected')
                    } else {
                        mySelectBoxMemory.selectedArr.splice(mySelectBoxMemory.selectedArr.indexOf(button), 1)
                        button.classList.remove('spriteCanvasTileSelected')
                    }
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


            }
        })

        button.addEventListener('mouseenter', (e) => {
            // paste preview rendering
            if (spriteCanvas.pasteFlag) {
                spriteCanvas.renderPasteTilePreview(this.spriteDiv.id)
            }

            mySpriteCanvasMemory.hoveredTile = button

            // selectbox Interaction
            if (spriteCanvas.mySelectBoxMemory.mouseDown && !spriteCanvas.pasteFlag) {
                spriteCanvas.mySelectBoxMemory.endTargetDiv = (e.target as HTMLDivElement)
                spriteCanvas.selectTiles(spriteCanvas.mySelectBoxMemory.initialTargetDiv!.id, (e.target as HTMLDivElement).id)
            }
        })

        this.spriteDiv = button
    }

    /*
    * Clears selected tiles from memory
    */
    clearTileSelection() {
        this.spriteDiv.className = "spriteCanvasTile";
        mySpriteCanvasMemory.selectedCanvasTile = undefined
    }
}
