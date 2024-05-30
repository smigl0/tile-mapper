interface SpriteCanvasMemory {
    buttonsArray: Array<HTMLButtonElement>,
    buttonsArray2d: HTMLButtonElement[][],
    selectedCanvasTile: (HTMLButtonElement | undefined),
    selectedId?: number,
    hoveredTile?: HTMLButtonElement
}


/*
* mySpriteCanvasMemory is a variable shared between files, used to share memory
*/
let mySpriteCanvasMemory: SpriteCanvasMemory = {
    buttonsArray: [],
    buttonsArray2d: [],
    selectedCanvasTile: undefined,
}

export default mySpriteCanvasMemory