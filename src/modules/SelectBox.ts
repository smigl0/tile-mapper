import mySelectBoxMemory from "./SelectBoxMemory"
import SpriteCanvas from "./SpriteCanvas";

/**
 * Enum for selection modes
 * @enum {string}
 */
enum SelectMode {
    add = "+",
    remove = "-",
    standard = ""
}

/**
 * Selection box class
 */
class SelectBox {
    /**
     * Memory shared across selection boxes
     * @type {SelectBoxMemory}
     */
    public mySelectboxMemory = mySelectBoxMemory;

    /**
     * Memory shared with the sprite canvas
     */
    public mySpriteCanvasMemory;

    /**
     * The div element used for the selection box
     * @type {HTMLDivElement}
     */
    selectBoxDiv: HTMLDivElement = document.createElement('div');

    /**
     * Creates an instance of SelectBox
     * @param {SpriteCanvas} spriteCanvas - The sprite canvas instance
     * @param {HTMLDivElement} targetDiv - The target div element for the selection box
     */
    constructor(spriteCanvas: SpriteCanvas, targetDiv: HTMLDivElement) {
        this.mySpriteCanvasMemory = spriteCanvas.mySpriteCanvasMemory;

        this.selectBoxDiv.className = "selectBox";
        this.selectBoxDiv.style.width = "0px";
        this.selectBoxDiv.style.height = "0px";
        targetDiv.append(this.selectBoxDiv);

        let initialClientX = 0;
        let initialClientY = 0;

        targetDiv.addEventListener('mousedown', (e) => {
            if (e.shiftKey) {
                this.mySelectboxMemory.selectionMode = SelectMode.remove;
            } else {
                this.mySelectboxMemory.selectionMode = SelectMode.standard;
            }

            this.selectBoxDiv.style.display = "none";
            this.selectBoxDiv.style.width = "0px";
            this.selectBoxDiv.style.height = "0px";
            initialClientX = 0;
            initialClientY = 0;

            this.selectBoxDiv.style.display = "block";

            initialClientX = e.clientX;
            initialClientY = e.clientY;

            this.selectBoxDiv.style.top = `${e.clientY}px`;
            this.selectBoxDiv.style.left = `${e.clientX}px`;

            mySelectBoxMemory.initialTargetDiv = e.target as HTMLDivElement;
            // @ts-expect-error
            mySelectBoxMemory.initialTargetDivId = (e.target as HTMLDivElement).id;
        });

        document.addEventListener('mousemove', (e) => {
            if (mySelectBoxMemory.mouseDown) {
                if (e.clientX > initialClientX) {
                    this.selectBoxDiv.style.left = `${initialClientX}px`;
                    this.selectBoxDiv.style.width = `${e.clientX - initialClientX}px`;
                } else {
                    this.selectBoxDiv.style.width = `${initialClientX - e.clientX}px`;
                    this.selectBoxDiv.style.left = `${e.clientX}px`;
                }

                if (e.clientY > initialClientY) {
                    this.selectBoxDiv.style.top = `${initialClientY}px`;
                    this.selectBoxDiv.style.height = `${e.clientY - initialClientY}px`;
                } else {
                    this.selectBoxDiv.style.height = `${initialClientY - e.clientY}px`;
                    this.selectBoxDiv.style.top = `${e.clientY}px`;
                }
            }
        });

        targetDiv.addEventListener('onblur', () => {
            this.selectBoxDiv.style.display = "none";
            this.selectBoxDiv.style.width = "0px";
            this.selectBoxDiv.style.height = "0px";
            initialClientX = 0;
            initialClientY = 0;
        });

        document.addEventListener('mouseup', () => {
            this.selectBoxDiv.style.display = "none";
            this.selectBoxDiv.style.width = "0px";
            this.selectBoxDiv.style.height = "0px";
            initialClientX = 0;
            initialClientY = 0;
            // console.log(mySelectBoxMemory.selectedArr);
        });
    }
}

export { SelectBox }
export default SelectBox
