import SpriteCanvasTile from "./SpriteCanvasTile";
import SpriteSheet from "./SpriteSheet";
import SelectBox from "./SelectBox";

import mySpriteCanvasMemory from "./SpriteCanvasMemory"

document.onkeydown = function (e) {
    e.preventDefault()
}

enum SelectMode {
    add = "+",
    remove = "-",
    standard = ""
}

interface ChangeMemory {
    affectedTiles: HTMLButtonElement[],
    action: string,
    fill?: string,
    complexFill?: number[],
    complexFillDataUrls?: string[],
    previousTiles: number[],
    previousDataUrls: string[]
}

interface PasteBuffer {
    spriteDataUrls: string[],
    compressedTiles: number[],

    // these are not the ones hovered
    // these are the ones you take from
    affectedTiles: HTMLButtonElement[],
    affectedTileIds: string[],
    affectedTilesPositionMatrix: number[][],

    // these get affected in real time
    beforeRenderAffectedTiles?: HTMLButtonElement[],
    beforeRenderAffectedTilesCompressed?: number[],
    beforeRenderAffectedTileDataUrls?: string[],

    // these get rerendered
    previousAffectedTiles?: HTMLButtonElement[],
    previousAffectedTilesCompressed?: number[],
    previousAffectedTileDataUrls?: string[],
}

/**
 * SpriteCanvas class. Used to define the canvas
 */
class SpriteCanvas {

    public spriteTiles: Array<HTMLDivElement> = []

    public mySpriteCanvasMemory = mySpriteCanvasMemory;
    public mySelectBoxMemory;

    public myChangeMemory: ChangeMemory[] = []
    public myChangeMemoryIndex: number = 0


    // paste
    public pasteFlag: boolean = false
    public pastePrevious: PasteBuffer = {
        spriteDataUrls: [],
        compressedTiles: [],
        affectedTileIds: [],
        affectedTiles: [],
        affectedTilesPositionMatrix: []
    }
    public myPasteBuffer: PasteBuffer = {
        spriteDataUrls: [],
        compressedTiles: [],
        affectedTileIds: [],
        affectedTiles: [],
        affectedTilesPositionMatrix: []
    }

    public autoselectFlag = true

    /**
     * Constructs a new instance of the class.
     *
     * @param spriteSheet - The sprite sheet object containing the sprite images.
     * @param targetDiv - The HTML div element where the sprites will be rendered.
     * @param width - The width of the target div element in pixels.
     * @param height - The height of the target div element in pixels.
     */
    constructor(spriteSheet: SpriteSheet, targetDiv: HTMLDivElement, width: number, height: number) {

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

        let ul = document.createElement('ul')

        let li = document.createElement('li')
        li.addEventListener('mousedown', () => { this.undo() })
        li.innerHTML = '<span><i class="bi bi-arrow-counterclockwise"></i> Undo <span style="float:right;">Ctrl + Z</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => { this.redo() })
        li.innerHTML = '<span><i class="bi bi-arrow-clockwise"></i> Redo <span style="float:right;">Ctrl + U</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.className = "contextMenu-divider-li"
        li.innerHTML = '<hr class="contextMenu-divider">'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => { this.copyTiles(this.mySelectBoxMemory.selectedArr) })
        li.innerHTML = '<span><i class="bi bi-copy"></i> Copy <span style="float:right;">Ctrl + C</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => { this.pasteTiles() })
        li.innerHTML = '<span><i class="bi bi-clipboard2"></i> Paste <span style="float:right;">Ctrl + V</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => {
            this.copyTiles(this.mySelectBoxMemory.selectedArr)
            this.deleteTiles(this.mySelectBoxMemory.selectedArr, true)
        })
        li.innerHTML = '<span><i class="bi bi-scissors"></i> Cut <span style="float:right;">Ctrl + X</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => {
            this.deleteTiles(this.mySelectBoxMemory.selectedArr, true)
        })
        li.innerHTML = '<span><i class="bi bi-trash3"></i> Delete <span style="float:right;">Ctrl + M</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.className = "contextMenu-divider-li"
        li.innerHTML = '<hr class="contextMenu-divider">'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => {
            this.autoselectFlag = Boolean(1 - Number(this.autoselectFlag))
        })
        li.innerHTML = '<span><i class="bi bi-plus-square-fill"></i> Toggle mapping <span style="float:right;">Ctrl + M</span>'
        ul.appendChild(li)

        li = document.createElement('li')
        li.className = "contextMenu-divider-li"
        li.innerHTML = '<hr class="contextMenu-divider">'
        ul.appendChild(li)

        li = document.createElement('li')
        li.addEventListener('mousedown', () => {
            this.save()
        })
        li.innerHTML = '<span><i class="bi bi-floppy-fill"></i> Save <span style="float:right;">Ctrl + S</span>'
        ul.appendChild(li)

        li = document.createElement('li')

        let input = document.createElement('span')
        input.innerHTML = '<i class="bi bi-file-earmark-arrow-up-fill"></i> Load <span style="float:right;">Ctrl + L'
        // input.onclick = ''
        li.addEventListener('click', () => {
            this.load()
        })
        li.appendChild(input)
        // li.innerHTML = '<span><i class="bi bi-file-earmark-arrow-up-fill"></i> Load <span style="float:right;">Ctrl + L</span>'

        ul.appendChild(li)


        contextMenuDiv.appendChild(ul)

        targetDiv.append(contextMenuDiv)

        targetDiv.addEventListener('contextmenu', (e) => {

            contextMenuDiv.style.top = `${e.pageY}px`
            contextMenuDiv.style.left = `${e.pageX}px`

            contextMenuDiv.style.display = "block"
        })

        targetDiv.addEventListener('click', () => {
            contextMenuDiv.style.display = "none"
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
                    case 'd':
                        this.deleteTiles(this.mySelectBoxMemory.selectedArr, true)
                        break;
                    case 'x':
                        this.copyTiles(this.mySelectBoxMemory.selectedArr)
                        this.deleteTiles(this.mySelectBoxMemory.selectedArr, true)
                        break;
                    case 'v':
                        this.pasteTiles()
                        this.resetAllSelection()
                        this.renderPasteTilePreview(this.mySpriteCanvasMemory.hoveredTile!.id)
                        break;
                    case 'm':
                        this.autoselectFlag = Boolean(1 - Number(this.autoselectFlag))
                        break;
                    case 'z':
                        this.undo()
                        break;
                    case 'y':
                    case 'q':
                        this.redo()
                        break;
                    case 's':
                        this.save()
                        break;
                    case 'l':
                        this.load()
                        break;
                }
            }
        })
    }

    // select tiles

    /**
     * Automatically selects next tile.
     */
    autoSelect() {
        // let autoSelectedTileId = this.mySpriteCanvasMemory.selectedId! + 1
        let autoSelectedTile = this.mySpriteCanvasMemory.buttonsArray[this.mySpriteCanvasMemory.selectedId! + 1]
        let previousAutoSelectedTile = this.mySpriteCanvasMemory.buttonsArray[this.mySpriteCanvasMemory.selectedId!]

        this.mySpriteCanvasMemory.selectedCanvasTile = autoSelectedTile

        this.mySpriteCanvasMemory.selectedId!++

        previousAutoSelectedTile.classList.remove('spriteCanvasTileClicked')
        autoSelectedTile.classList.add('spriteCanvasTileClicked')

        this.mySpriteCanvasMemory.selectedId

        this.mySelectBoxMemory.selectedArr = [autoSelectedTile]
    }

    /**
     * Resets all selection methods.
     */
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

    /**
     * Selected tiles from beggining id to ending id.
     * @param startingTileId - Starting tile id
     * @param endingTileId - Starting tile id
     */
    selectTiles(startingTileId: string, endingTileId: string) {
        let [startingX, startingY]: number[] = startingTileId.split('-').map(Number)
        let [endingX, endingY]: number[] = endingTileId.split('-').map(Number)

        let deltaX: number = Math.abs(startingX - endingX)
        let deltaY: number = Math.abs(startingY - endingY)

        if (startingX > endingX) { startingX -= deltaX }
        if (startingY > endingY) { startingY -= deltaY }

        let currentSelected: HTMLButtonElement[] = []

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

    /**
     * Selected tiles from beggining id to ending id.
     * @param startingTileId - Starting tile id
     * @param endingTileId - Starting tile id
     */
    drawTiles(selectedTiles: HTMLButtonElement[], spriteDataString: string, redoFlag: boolean = false) {

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

    /**
     * Copies and compresses tiles to memory object
     * @param selectedTiles - Array of selected tiles
     */
    copyTiles(selectedTiles: HTMLButtonElement[]) {

        selectedTiles = selectedTiles.filter((value, index, array) => array.indexOf(value) === index)

        let spriteDataUrls = selectedTiles.map(selectedTiles => selectedTiles.style.backgroundImage).filter((value, index, array) => array.indexOf(value) === index)

        let compressedTiles: Array<number> = []
        let compressedTileIds: Array<string> = []
        let out: Array<HTMLButtonElement> = []

        selectedTiles.forEach(element => {
            compressedTiles.push(spriteDataUrls.indexOf(element.style.backgroundImage))
            compressedTileIds.push(element.id)
            out.push(element)
        })

        // note: add copying to public class memory
        // note: why did i write this?

        this.myPasteBuffer = {
            spriteDataUrls: spriteDataUrls,
            compressedTiles: compressedTiles,
            affectedTileIds: compressedTileIds,
            affectedTiles: out,
            affectedTilesPositionMatrix: []
        }
    }

    /**
     * Begins rendering the paste preview
     */
    pasteTiles() {

        if (!this.pasteFlag) {
            let initialX, initialY
            [initialX, initialY] = this.myPasteBuffer.affectedTileIds[0].split('-').map(Number)


            // backup of old pastebuffer

            this.myPasteBuffer.affectedTileIds.forEach((element) => {

                // positions
                let absoluteX, absoluteY
                [absoluteX, absoluteY] = element.split('-').map(Number)

                this.myPasteBuffer.affectedTilesPositionMatrix.push([absoluteX - initialX, absoluteY - initialY])

            })

            console.log(this.myPasteBuffer.affectedTilesPositionMatrix);


            // flag that is passed to all children div
            // so that they can render the paste preview
            this.pasteFlag = true
        }

    }

    /**
     * Renders paste tile preview
     * @param tileId - Tileid where it begins rendering
     */
    renderPasteTilePreview(tileId: string) {
        let currentX: number
        let currentY: number

        [currentX, currentY] = tileId.split('-').map(Number)

        //generation of new previous affected tiles

        // preview reset draw

        if (this.myPasteBuffer.previousAffectedTiles != undefined) {
            this.myPasteBuffer.previousAffectedTiles.forEach((ele, index) => {
                if (ele != undefined) {
                    ele.style.backgroundImage = this.myPasteBuffer.previousAffectedTileDataUrls![this.myPasteBuffer.previousAffectedTilesCompressed![index]]

                    if (this.myPasteBuffer.previousAffectedTileDataUrls![this.myPasteBuffer.previousAffectedTilesCompressed![index]] == '') {
                        ele.className = 'spriteCanvasTile'
                    } else {
                        ele.className = 'spriteCanvasTile spriteCanvasFilled'
                    }
                }
            })
        }

        this.myPasteBuffer.previousAffectedTiles = []
        this.myPasteBuffer.previousAffectedTileDataUrls = []
        this.myPasteBuffer.previousAffectedTilesCompressed = []

        // post preview reset draw
        this.myPasteBuffer.beforeRenderAffectedTiles = []
        this.myPasteBuffer.beforeRenderAffectedTilesCompressed = []
        this.myPasteBuffer.beforeRenderAffectedTileDataUrls = []

        this.myPasteBuffer.affectedTilesPositionMatrix.forEach((element, index) => {

            let affectedTile = this.mySpriteCanvasMemory.buttonsArray2d[currentY + element[1]][currentX + element[0]]

            this.myPasteBuffer.beforeRenderAffectedTiles!.push(affectedTile)

            // backup to before

            if (affectedTile == undefined) {
                this.myPasteBuffer.beforeRenderAffectedTilesCompressed!.push(-1)
            } else {
                if (!this.myPasteBuffer.beforeRenderAffectedTileDataUrls!.includes(affectedTile.style.backgroundImage)) {
                    this.myPasteBuffer.beforeRenderAffectedTileDataUrls!.push(affectedTile.style.backgroundImage)
                }

                this.myPasteBuffer.beforeRenderAffectedTilesCompressed!.push(this.myPasteBuffer.beforeRenderAffectedTileDataUrls!.indexOf(affectedTile.style.backgroundImage))

            }

            // create previous

            this.myPasteBuffer.previousAffectedTiles!.push(affectedTile)

            if (affectedTile != undefined) {

                if (
                    !this.myPasteBuffer.previousAffectedTileDataUrls!
                        .includes(affectedTile.style.backgroundImage)
                ) {
                    this.myPasteBuffer.previousAffectedTileDataUrls!.push(affectedTile.style.backgroundImage)
                }

                // ????
                // it didnt work now it does
                // :[ ]

                this.myPasteBuffer.previousAffectedTilesCompressed!.push(this.myPasteBuffer.previousAffectedTileDataUrls!.indexOf(affectedTile.style.backgroundImage))

                // draw new
                affectedTile.style.backgroundImage = this.myPasteBuffer.spriteDataUrls[this.myPasteBuffer.compressedTiles[index]]

                if (this.myPasteBuffer.spriteDataUrls[this.myPasteBuffer.compressedTiles[index]] == '') {
                    affectedTile.className = 'spriteCanvasTile'
                } else {
                    affectedTile.className = 'spriteCanvasTile spriteCanvasFilled'
                }
            } else {
                this.myPasteBuffer.previousAffectedTilesCompressed!.push(-1)
            }
        });

        // console.log(this.myPasteBuffer.previousAffectedTileDataUrls, this.myPasteBuffer.previousAffectedTilesCompressed);

        console.log(this.myPasteBuffer);

    }

    /**
     * Actually draws the tiles to the canvas
     */
    pasteTilesDraw() {

        // in reality this dosent draw it only adds itself to memory
        // since the renderPaste dosent really draw it just stops 
        // unrendering previous preview renders
        //
        // im so done
        // i want to draw


        console.log(this.myPasteBuffer);


        this.myChangeMemory[this.myChangeMemoryIndex] = {
            affectedTiles: [...this.myPasteBuffer.beforeRenderAffectedTiles!],
            action: 'addComplex',
            complexFill: [...this.myPasteBuffer.compressedTiles],
            complexFillDataUrls: [...this.myPasteBuffer.spriteDataUrls],
            previousTiles: [...this.myPasteBuffer.beforeRenderAffectedTilesCompressed!],
            previousDataUrls: [...this.myPasteBuffer.beforeRenderAffectedTileDataUrls!]
        }

        this.myChangeMemoryIndex++

        this.pasteFlag = false

        this.myPasteBuffer = {
            spriteDataUrls: [],
            compressedTiles: [],
            affectedTileIds: [],
            affectedTiles: [],
            affectedTilesPositionMatrix: []
        }

        console.log(this.myChangeMemory);

    }

    /**
     * Deletes tiles off of canvas
     * @param selectedTiles - Array of selected tiles to delete
     * @param redoFlag  - Boolean dictating wether redo is meant to create new timeline
     */
    deleteTiles(selectedTiles: HTMLButtonElement[], redoFlag: boolean = false) {

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

    /**
     * Undo-s last action
     */
    undo() {
        console.log('-- UNDO --');

        if (this.myChangeMemoryIndex != 0 && !this.pasteFlag) {
            this.myChangeMemoryIndex--


            if (this.myChangeMemory[this.myChangeMemoryIndex].action != "addComplex") {
                this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles.forEach((element, index) => {


                    element.style.backgroundImage = this.myChangeMemory[this.myChangeMemoryIndex].previousDataUrls[this.myChangeMemory[this.myChangeMemoryIndex].previousTiles[index]]

                    // reset border
                    if (element.style.backgroundImage != "") { element.classList.remove('spriteCanvasFilled') } else { element.classList.add('spriteCanvasTileFilled') }


                })
            } else {
                this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles.forEach((element, index) => {
                    if (element != undefined) {
                        element.style.backgroundImage =
                            this.myChangeMemory[
                                this.myChangeMemoryIndex
                            ].previousDataUrls[
                            this.myChangeMemory[this.myChangeMemoryIndex].previousTiles[index]
                            ]

                        if (element.style.backgroundImage == '') {
                            element.classList.remove("spriteCanvasFilled")
                        } else {
                        }
                    }
                })

            }
        }

        this.renderPasteTilePreview(this.mySpriteCanvasMemory.hoveredTile!.id)
    }

    /**
     * Redo-s last undone action
     */
    redo() {
        console.log('-- REDO --');

        if (this.myChangeMemoryIndex < this.myChangeMemory.length && !this.pasteFlag) {

            switch (this.myChangeMemory[this.myChangeMemoryIndex].action) {
                case 'add':
                    this.drawTiles(this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles, this.myChangeMemory[this.myChangeMemoryIndex].fill!)
                    break;
                case 'del':
                    this.deleteTiles(this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles)
                    break;
                case 'addComplex':
                    console.log(this.myChangeMemory[this.myChangeMemoryIndex]);
                    this.myChangeMemory[this.myChangeMemoryIndex].affectedTiles.forEach((element, index) => {
                        if (element != undefined) {
                            element.style.backgroundImage =
                                this.myChangeMemory[
                                    this.myChangeMemoryIndex
                                ].complexFillDataUrls![
                                this.myChangeMemory[this.myChangeMemoryIndex].complexFill![index]
                                ]
                            if (element.style.backgroundImage != '') {
                                element.classList.add('spriteCanvasFilled')
                            }
                        }
                    })

                    this.myChangeMemoryIndex++
                    break;
            }
        }

        this.renderPasteTilePreview(this.mySpriteCanvasMemory.hoveredTile!.id)
    }

    /**
     * Caps memory of actions at currently used action
     */
    capMemory() {
        this.myChangeMemory = this.myChangeMemory.slice(0, this.myChangeMemoryIndex)
        console.log(this.myChangeMemory);

    }

    /**
     * Saves the canvas layout
     */
    save() {
        interface saveData {
            compressedTiles?: number[],
            spriteDataUrls?: string[]
        }

        let data: (saveData) = {}

        let compressedTiles: number[] = []
        let spriteDataUrls: string[] = []

        this.mySpriteCanvasMemory.buttonsArray.forEach(element => {
            if (!spriteDataUrls.includes(element.style.backgroundImage)) {
                spriteDataUrls.push(element.style.backgroundImage)
            }
            compressedTiles.push(spriteDataUrls.indexOf(element.style.backgroundImage))
        });

        data.compressedTiles = compressedTiles
        data.spriteDataUrls = spriteDataUrls

        let outData: string = JSON.stringify(data)

        const blob = new Blob([outData], { type: 'json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a')
        a.href = url
        a.download = "save.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    /**
     * Loads the canvas layout
     */
    load() {
        console.log(this);

        interface saveData {
            compressedTiles?: number[],
            spriteDataUrls?: string[]
        }

        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'



        let myCanvasButtonArray: HTMLButtonElement[] = this.mySpriteCanvasMemory.buttonsArray

        input.onchange = e => {

            // getting a hold of the file reference
            //@ts-ignore
            var file = e.target.files[0];

            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');



            // here we tell the reader what to do when it's done reading...
            reader.onload = (readerEvent) => {
                //@ts-ignore
                var content: saveData = JSON.parse(readerEvent.target.result) // this is the content!
                console.log(content);

                myCanvasButtonArray.forEach((ele, index) => {
                    ele.style.backgroundImage = content.spriteDataUrls![content.compressedTiles![index]]
                    if (ele.style.backgroundImage != "") {
                        ele.classList.add('spriteCanvasFilled')
                    } else {
                        ele.className = "spriteCanvasTile"
                    }
                });
            }

        }

        input.click();

        console.log('');
    }
}

export type { SpriteCanvas }
export default SpriteCanvas