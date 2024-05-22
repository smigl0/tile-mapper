interface SpriteCanvasMemory {
    buttonsArray: Array<HTMLElement>,
    buttonsArray2d: HTMLElement[][],
    selectedCanvasTileId: (number | undefined),
    selectedCanvasTileIdPrevious: (number | undefined)
}

let mySpriteCanvasMemory: SpriteCanvasMemory = {
    buttonsArray: [],
    buttonsArray2d: [],
    selectedCanvasTileId: undefined,
    selectedCanvasTileIdPrevious: undefined
}

export default mySpriteCanvasMemory