import SpriteCanvasTile from "./SpriteCanvasTIle";
import SpriteSheet from "./SpriteSheet";
import mySpriteCanvasMemory from "./SpriteCanvasMemory"
import mySelectBoxMemory from "./SelectBoxMemory";

export default class SpriteCanvas {

    public spriteTiles: Array<HTMLElement> = []

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

        let selectBoxDiv = document.createElement('div')
        selectBoxDiv.className = "selectBox"
        selectBoxDiv.style.width = "0px"
        selectBoxDiv.style.height = "0px"
        targetDiv.append(selectBoxDiv)

        let initialClientX = 0
        let initialClientY = 0

        targetDiv.addEventListener('mousedown', (e) => {
            selectBoxDiv.style.display = "none"
            selectBoxDiv.style.width = "0px"
            selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0

            selectBoxDiv.style.display = "block"
            console.log(e.clientX);
            console.log(e.clientY);

            initialClientX = e.clientX
            initialClientY = e.clientY

            selectBoxDiv.style.top = `${e.clientY}px`
            selectBoxDiv.style.left = `${e.clientX}px`


            mySelectBoxMemory.initialTargetDiv = <HTMLElement>e.target
            // @ts-expect-error
            mySelectBoxMemory.initialTargetDivId = <HTMLElement>e.target.id
        })

        document.addEventListener('mousemove', (e) => {

            if (e.clientX > initialClientX) {
                selectBoxDiv.style.left = `${initialClientX}px`
                selectBoxDiv.style.width = `${e.clientX - initialClientX}px`

            } else {
                selectBoxDiv.style.width = `${initialClientX - e.clientX}px`
                selectBoxDiv.style.left = `${e.clientX}px`
            }

            if (e.clientY > initialClientY) {
                selectBoxDiv.style.top = `${initialClientY}px`
                selectBoxDiv.style.height = `${e.clientY - initialClientY}px`
            } else {
                selectBoxDiv.style.height = `${initialClientY - e.clientY}px`
                selectBoxDiv.style.top = `${e.clientY}px`
            }


        })

        targetDiv.addEventListener('onblur', () => {
            selectBoxDiv.style.display = "none"
            selectBoxDiv.style.width = "0px"
            selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0
        })

        document.addEventListener('mouseup', (e) => {
            selectBoxDiv.style.display = "none"
            selectBoxDiv.style.width = "0px"
            selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0
            // console.log(e);
        })

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
            console.log('penis');
            console.log(e);

            contextMenuDiv.style.top = `${e.pageY}px`
            contextMenuDiv.style.left = `${e.pageX}px`

            contextMenuDiv.style.display = "block"
        })

        document.addEventListener('mousedown', (e) => {
            console.log(e.target);

            // @ts-expect-error
            if (e.target.localName != "a" || e.target.localName != "li") {
                contextMenuDiv.style.display = "none"
            }

        })

        document.addEventListener('mousedown', () => {
            mySelectBoxMemory.mouseDown = true
        })

        document.addEventListener('mouseup', () => {
            mySelectBoxMemory.mouseDown = false
        })
    }

    // select tiles

    selectTiles(startingTileId: string, endingTileId: string) {
        let [startingX, startingY]: number[] = startingTileId.split('-').map(Number)
        let [endingX, endingY]: number[] = endingTileId.split('-').map(Number)

        let deltaX: number = Math.abs(startingX - endingX)
        let deltaY: number = Math.abs(startingY - endingY)

        if (startingX > endingX) { startingX -= deltaX }
        if (startingY > endingY) { startingY -= deltaY }

        // console.log(deltaX, deltaY);

        if (mySelectBoxMemory.previousSelected.length != 0) {

        }

        let currentSelected: HTMLElement[] = []

        mySelectBoxMemory.previousSelected.forEach(element => {
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
        mySelectBoxMemory.previousSelected = currentSelected


        console.log('---pause---');
    }
}