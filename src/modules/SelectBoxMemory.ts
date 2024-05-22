interface SelectBoxMemory {
    mouseDown: (boolean)
    initialTargetDiv: (HTMLElement | undefined),
    endTargetDiv: (HTMLElement | undefined),
    selectedArr: (HTMLElement[]),
    selectionMode: string
}

let mySelectBoxMemory: SelectBoxMemory = {
    mouseDown: false,
    initialTargetDiv: undefined,
    endTargetDiv: undefined,
    selectedArr: [],
    selectionMode: ""
}

export default mySelectBoxMemory