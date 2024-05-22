import SpriteCanvasTile from "./SpriteCanvasTile";
import SpriteSheet from "./SpriteSheet";
import SelectBox from "./SelectBox";

import mySpriteCanvasMemory from "./SpriteCanvasMemory"

export default class SpriteCanvas {

    public spriteTiles: Array<HTMLElement> = []

    public mySpriteCanvasMemory = mySpriteCanvasMemory;

    public mySelectBoxMemory;

    constructor(spriteSheet: SpriteSheet, targetDiv: HTMLElement, width: number, height: number) {

        let canvasDiv = document.createElement('div')
        canvasDiv.classList.add('spriteCanvas')

        for (let y = 0; y < height; y++) {
            let row = document.createElement('div')
            row.classList.add('spriteTr');

            mySpriteCanvasMemory.buttonsArray2d.push([])

            for (let x = 0; x < width; x++) {
                let button = new SpriteCanvasTile(this, mySpriteCanvasMemory.buttonsArray.length, x, y)

                mySpriteCanvasMemory.buttonsArray.push(button.spriteDiv)
                mySpriteCanvasMemory.buttonsArray2d[y].push(button.spriteDiv)

                row.append(button.spriteDiv)
            }
            canvasDiv.append(row)
        }

        targetDiv.append(canvasDiv)
        console.log(mySpriteCanvasMemory);

        //  selectbox
        let selectBox = new SelectBox(this, targetDiv)

        this.mySelectBoxMemory = selectBox.mySelectboxMemory

        // context menu creation  show/hide mechanism

        let contextMenuDiv = document.createElement('div')
        contextMenuDiv.className = "contextMenu"

        contextMenuDiv.innerHTML = `
            <ul class="contextMenuUl">
                <li>
                    <i class="bi bi-arrow-counterclockwise"></i> Undo <span style="float:right;">Ctrl + Z</span>
                </li>
                <li>
                    <i class="bi bi-arrow-clockwise"></i> Redo <span style="float:right;">Ctrl + U</span>
                </li>
                <li class="contextMenu-divider-li">
                    <hr class="contextMenu-divider">
                </li>
                <li>
                    <i class="bi bi-copy"></i> Copy <span style="float:right;">Ctrl + C</span>
                </li>
                <li>
                    <i class="bi bi-clipboard2"></i> Paste <span style="float:right;">Ctrl + V</span>
                </li>
                <li>
                    <i class="bi bi-scissors"></i> Cut <span style="float:right;">Ctrl + X</span>
                </li>
                <li>
                    <i class="bi bi-trash3"></i> Delete <span style="float:right;">Ctrl + M</span>
                </li>
                <li class="contextMenu-divider-li">
                    <hr class="contextMenu-divider">
                </li>
                <li>
                    <i class="bi bi-plus-square-fill"></i> Toggle mapping <span style="float:right;">Ctrl + M</span>
                </li>
                <li class="contextMenu-divider-li">
                    <hr class="contextMenu-divider">
                </li>
                <li>
                    <i class="bi bi-floppy-fill"></i> Save <span style="float:right;">Ctrl + S</span>
                </li>
                <li>
                    <i class="bi bi-file-earmark-arrow-up-fill"></i> Load <span style="float:right;">Ctrl + L</span>
                </li>
            </ul>
        `

        targetDiv.append(contextMenuDiv)

        targetDiv.addEventListener('contextmenu', (e) => {

            contextMenuDiv.style.top = `${e.pageY}px`
            contextMenuDiv.style.left = `${e.pageX}px`

            contextMenuDiv.style.display = "block"
        })

        document.addEventListener('mousedown', (e) => {
            // @ts-expect-error
            if (e.target.localName != "a" || e.target.localName != "li") {
                contextMenuDiv.style.display = "none"
            }

        })

        document.addEventListener('mousedown', () => {
            this.mySelectBoxMemory.mouseDown = true
        })

        document.addEventListener('mouseup', () => {
            this.mySelectBoxMemory.mouseDown = false
        })
    }

    // select tiles

    resetSelection() {
        console.log("--RESETTING SELECTION METHODS--");

        try { this.mySpriteCanvasMemory.buttonsArray[mySpriteCanvasMemory.selectedCanvasTileId!].className = "spriteCanvasTile" } catch (error) { }
        this.mySpriteCanvasMemory.selectedCanvasTileId = undefined

        this.mySelectBoxMemory.selectedArr.forEach(element => {
            element.className = "spriteCanvasTile"
        });

    }

    selectTiles(startingTileId: string, endingTileId: string) {
        let [startingX, startingY]: number[] = startingTileId.split('-').map(Number)
        let [endingX, endingY]: number[] = endingTileId.split('-').map(Number)

        let deltaX: number = Math.abs(startingX - endingX)
        let deltaY: number = Math.abs(startingY - endingY)

        if (startingX > endingX) { startingX -= deltaX }
        if (startingY > endingY) { startingY -= deltaY }

        let currentSelected: HTMLElement[] = []

        this.mySelectBoxMemory.selectedArr.forEach(element => {
            element.className = "spriteCanvasTile"
        });

        for (let y = 0; y < deltaY + 1; y++) {
            for (let x = 0; x < deltaX + 1; x++) {
                // console.log(mySpriteCanvasMemory.buttonsArray2d[y][x]);
                let currentTile = mySpriteCanvasMemory.buttonsArray2d[startingY + y][startingX + x]

                currentTile.className = "spriteCanvasTile spriteCanvasTileSelected"

                currentSelected.push(currentTile)
            }
        }

        this.mySelectBoxMemory.selectedArr = currentSelected
    }
}