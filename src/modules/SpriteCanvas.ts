import SpriteCanvasTile from "./SpriteCanvasTile";
import SpriteSheet from "./SpriteSheet";
import SelectBox from "./SelectBox";

import mySpriteCanvasMemory from "./SpriteCanvasMemory"

enum SelectMode {
    add = "+",
    remove = "-",
    standard = ""
}

interface ChangeMemory {
    affectedTiles: HTMLElement[],
    action: string,
    fill?: string,
    previousTiles: number[],
    previousDataUrls: string[]
}

export default class SpriteCanvas {

    public spriteTiles: Array<HTMLElement> = []

    public mySpriteCanvasMemory = mySpriteCanvasMemory;
    public mySelectBoxMemory;

    public myChangeMemory: ChangeMemory[] = []
    public myChangeMemoryIndex: number = 0


    constructor(spriteSheet: SpriteSheet, targetDiv: HTMLElement, width: number, height: number) {

        spriteSheet.spriteCanvas = this

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

        document.addEventListener('mousedown', () => {
            this.mySelectBoxMemory.mouseDown = true
        })

        document.addEventListener('mouseup', () => {
            this.mySelectBoxMemory.mouseDown = false
        })


        // key shortcut router

        document.addEventListener('keydown', (evt) => {
            if (evt.ctrlKey) {
                switch (evt.key) {
                    case 'c':
                        this.copyTiles(this.mySelectBoxMemory.selectedArr)
                        break;
                    case 'x':
                        this.copyTiles(this.mySelectBoxMemory.selectedArr)
                        this.deleteTiles(this.mySelectBoxMemory.selectedArr, true)
                        break;
                    case 'm':
                        this.deleteTiles(this.mySelectBoxMemory.selectedArr)
                        break;
                    case 'z':
                        this.undo()
                        break;
                    case 'y':
                    case 'q':
                        this.redo()
                        break;
                }
            }
        })
    }

    // select tiles

    autoSelect() {
        let autoSelectedTileId = this.mySpriteCanvasMemory.selectedId! + 1
        let autoSelectedTile = this.mySpriteCanvasMemory.buttonsArray[this.mySpriteCanvasMemory.selectedId! + 1]
        let previousAutoSelectedTile = this.mySpriteCanvasMemory.buttonsArray[this.mySpriteCanvasMemory.selectedId!]


        this.mySpriteCanvasMemory.selectedId!++

        previousAutoSelectedTile.classList.remove('spriteCanvasTileClicked')
        autoSelectedTile.classList.add('spriteCanvasTileClicked')

        this.mySpriteCanvasMemory.selectedId

        this.mySelectBoxMemory.selectedArr = [autoSelectedTile]
    }

    resetAllSelection() {
        console.log("--RESETTING ALL SELECTION METHODS--");

        try {
            this.mySpriteCanvasMemory.selectedCanvasTile!.classList.remove('spriteCanvasTileSelected');
            this.mySpriteCanvasMemory.selectedCanvasTile!.classList.remove('spriteCanvasTileClicked');
        } catch (error) { }
        this.mySpriteCanvasMemory.selectedCanvasTile = undefined

        this.mySelectBoxMemory.selectedArr.forEach(element => {
            element.classList.remove("spriteCanvasTileSelected")
        });

        this.mySelectBoxMemory.selectedArr = []

    }

    selectTiles(startingTileId: string, endingTileId: string, selectMode: SelectMode = SelectMode.standard) {
        let [startingX, startingY]: number[] = startingTileId.split('-').map(Number)
        let [endingX, endingY]: number[] = endingTileId.split('-').map(Number)

        let deltaX: number = Math.abs(startingX - endingX)
        let deltaY: number = Math.abs(startingY - endingY)

        if (startingX > endingX) { startingX -= deltaX }
        if (startingY > endingY) { startingY -= deltaY }

        let currentSelected: HTMLElement[] = []

        if (this.mySelectBoxMemory.selectionMode == SelectMode.standard) {
            this.resetAllSelection()
        }

        for (let y = 0; y < deltaY + 1; y++) {
            for (let x = 0; x < deltaX + 1; x++) {
                // console.log(mySpriteCanvasMemory.buttonsArray2d[y][x]);
                let currentTile = mySpriteCanvasMemory.buttonsArray2d[startingY + y][startingX + x]

                currentTile.classList.add("spriteCanvasTileSelected")

                currentSelected.push(currentTile)
            }
        }

        // console.log(this.mySelectBoxMemory.selectedArr);
        // console.log(currentSelected);

        this.mySelectBoxMemory.selectedArr = [...this.mySelectBoxMemory.selectedArr, ...currentSelected]

    }

    drawTiles(selectedTiles: HTMLElement[], spriteDataString: string, redoFlag: boolean = false) {

        // memory formula

        let spriteDataUrls = selectedTiles.map(selectedTiles => selectedTiles.style.backgroundImage).filter((value, index, array) => array.indexOf(value) === index)

        let selectedTilesCompressed: Array<number> = []

        selectedTiles.forEach(element => {
            selectedTilesCompressed.push(spriteDataUrls.indexOf(element.style.backgroundImage))
        })

        this.myChangeMemory[this.myChangeMemoryIndex] = {
            affectedTiles: [...selectedTiles],
            action: 'add',
            fill: spriteDataString,
            previousTiles: selectedTilesCompressed,
            previousDataUrls: spriteDataUrls
        }

        this.myChangeMemoryIndex++

        // endof memory formula

        selectedTiles.forEach(element => {
            element.style.backgroundImage = `url(${spriteDataString})`
            element.classList.add('spriteCanvasFilled')
        });

        if (redoFlag) {
            this.capMemory()
        }
    }

    copyTiles(selectedTiles: HTMLElement[]) {

        selectedTiles = selectedTiles.filter((value, index, array) => array.indexOf(value) === index)

        let spriteDataUrls = selectedTiles.map(selectedTiles => selectedTiles.style.backgroundImage).filter((value, index, array) => array.indexOf(value) === index)

        let out: Array<number> = []

        selectedTiles.forEach(element => {
            out.push(spriteDataUrls.indexOf(element.style.backgroundImage))
        })

        // note: add copying to public class memory

    }

    deleteTiles(selectedTiles: HTMLElement[], redoFlag: boolean = false) {

        // memory formula

        let spriteDataUrls = selectedTiles.map(selectedTiles => selectedTiles.style.backgroundImage).filter((value, index, array) => array.indexOf(value) === index)

        let selectedTilesCompressed: Array<number> = []

        selectedTiles.forEach(element => {
            selectedTilesCompressed.push(spriteDataUrls.indexOf(element.style.backgroundImage))
        })

        this.myChangeMemory[this.myChangeMemoryIndex] = {
            affectedTiles: [...selectedTiles],
            action: 'del',
            previousTiles: selectedTilesCompressed,
            previousDataUrls: spriteDataUrls
        }

        this.myChangeMemoryIndex++

        // endof memory formula

        selectedTiles.forEach(element => {
            element.className = "spriteCanvasTile"
            element.style.backgroundImage = ""
            element.style.border = ""
        });

        this.resetAllSelection()

        if (redoFlag) {
            this.capMemory()
        }
    }

    undo() {
        console.log('-- UNDO --');

        if (this.myChangeMemoryIndex != 0) {
            this.myChangeMemoryIndex--
            console.log(this.myChangeMemory);


            this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles.forEach((element, index) => {


                element.style.backgroundImage = this.myChangeMemory[this.myChangeMemoryIndex].previousDataUrls[this.myChangeMemory[this.myChangeMemoryIndex].previousTiles[index]]

                // reset border
                if (element.style.backgroundImage != "") { element.style.border = "0px" } else { element.style.border = ""; element.classList.remove('spriteCanvasFilled') }


            })
        }
    }

    redo() {
        console.log('-- REDO --');

        if (this.myChangeMemoryIndex < this.myChangeMemory.length) {
            console.log(this.myChangeMemory);

            switch (this.myChangeMemory[this.myChangeMemoryIndex].action) {
                case 'add':
                    this.drawTiles(this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles, this.myChangeMemory[this.myChangeMemoryIndex].fill!)
                    break
                case 'del':
                    this.deleteTiles(this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles)
                    break;
            }
        }
    }

    capMemory() {
        this.myChangeMemory = this.myChangeMemory.slice(0, this.myChangeMemoryIndex)
        console.log(this.myChangeMemory);

    }
}