import mySelectBoxMemory from "./SelectBoxMemory"
import SpriteCanvas from "./SpriteCanvas";


enum SelectMode {
    add = "+",
    remove = "-",
    standard = ""
}

class SelectBox {

    public mySelectboxMemory = mySelectBoxMemory;

    public mySpriteCanvasMemory;

    selectBoxDiv: HTMLElement = document.createElement('div')
    constructor(spriteCanvas: SpriteCanvas, targetDiv: HTMLElement) {

        this.mySpriteCanvasMemory = spriteCanvas.mySpriteCanvasMemory

        this.selectBoxDiv.className = "selectBox"
        this.selectBoxDiv.style.width = "0px"
        this.selectBoxDiv.style.height = "0px"
        targetDiv.append(this.selectBoxDiv)

        let initialClientX = 0
        let initialClientY = 0

        targetDiv.addEventListener('mousedown', (e) => {
            if (e.shiftKey) {
                this.mySelectboxMemory.selectionMode = SelectMode.remove
            } else {
                this.mySelectboxMemory.selectionMode = SelectMode.standard
            }

            this.selectBoxDiv.style.display = "none"
            this.selectBoxDiv.style.width = "0px"
            this.selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0

            this.selectBoxDiv.style.display = "block"

            initialClientX = e.clientX
            initialClientY = e.clientY

            this.selectBoxDiv.style.top = `${e.clientY}px`
            this.selectBoxDiv.style.left = `${e.clientX}px`


            mySelectBoxMemory.initialTargetDiv = <HTMLElement>e.target
            // @ts-expect-error
            mySelectBoxMemory.initialTargetDivId = <HTMLElement>e.target.id
        })

        document.addEventListener('mousemove', (e) => {
            if (mySelectBoxMemory.mouseDown) {
                if (e.clientX > initialClientX) {
                    this.selectBoxDiv.style.left = `${initialClientX}px`
                    this.selectBoxDiv.style.width = `${e.clientX - initialClientX}px`

                } else {
                    this.selectBoxDiv.style.width = `${initialClientX - e.clientX}px`
                    this.selectBoxDiv.style.left = `${e.clientX}px`
                }

                if (e.clientY > initialClientY) {
                    this.selectBoxDiv.style.top = `${initialClientY}px`
                    this.selectBoxDiv.style.height = `${e.clientY - initialClientY}px`
                } else {
                    this.selectBoxDiv.style.height = `${initialClientY - e.clientY}px`
                    this.selectBoxDiv.style.top = `${e.clientY}px`
                }
            }
        })

        targetDiv.addEventListener('onblur', () => {
            this.selectBoxDiv.style.display = "none"
            this.selectBoxDiv.style.width = "0px"
            this.selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0
        })

        document.addEventListener('mouseup', () => {
            this.selectBoxDiv.style.display = "none"
            this.selectBoxDiv.style.width = "0px"
            this.selectBoxDiv.style.height = "0px"
            initialClientX = 0
            initialClientY = 0
            // console.log(mySelectBoxMemory.selectedArr);

        })
    }
}

export default SelectBox