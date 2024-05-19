import mySpriteCanvasMemory from "./SpriteCanvasMemory";
import myUserMemory from "./userData/UserMemory";
import mySelectBoxMemory from "./SelectBoxMemory";
import SpriteCanvas from "./SpriteCanvas";

export default class SpriteCanvasTile {

    public spriteDataString: string = '';
    public spriteDiv: HTMLElement;

    constructor(SpriteCanvas: SpriteCanvas, id: number, coordX: number, coordY: number) {
        let button = document.createElement('button')
        button.id = `${coordX}-${coordY}`


        button.classList.add('spriteCanvasTile')


        button.addEventListener('click', () => {


            myUserMemory.selectedCanvasTileIdPrevious = myUserMemory.selectedCanvasTileId
            myUserMemory.selectedCanvasTileId = id;
            button.className = "spriteCanvasTile spriteCanvasTileClicked"
            button.style.backgroundImage = `url('${myUserMemory.currentDataString}')`
            console.log(myUserMemory);

            if (myUserMemory.currentDataString != "") {
                myUserMemory.currentDataString = ""
                button.className = "spriteCanvasTile spriteCanvasTileFilled"
            }

            try { mySpriteCanvasMemory.buttonsArray[myUserMemory.selectedCanvasTileIdPrevious!].className = "spriteCanvasTile" } catch (error) { }
        })

        button.addEventListener('mouseenter', (e) => {
            if (mySelectBoxMemory.mouseDown) {
                // @ts-expect-error
                SpriteCanvas.selectTiles(mySelectBoxMemory.initialTargetDivId!, e.target!.id)
            }
        })

        this.spriteDiv = button
    }
}