interface SpriteCanvasMemory {
    buttonsArray: Array<HTMLElement>,
    buttonsArray2d: HTMLElement[][],
    selectedCanvasTile: (HTMLElement | undefined),
}

let mySpriteCanvasMemory: SpriteCanvasMemory = {
    buttonsArray: [],
    buttonsArray2d: [],
    selectedCanvasTile: undefined,
}

export default mySpriteCanvasMemory