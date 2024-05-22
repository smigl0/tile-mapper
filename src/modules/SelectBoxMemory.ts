interface SelectBoxMemory {
    mouseDown: (boolean)
    initialTargetDiv: (HTMLElement | undefined),
    endTargetDiv: (HTMLElement | undefined),
    selectedArr: (HTMLElement[])
}

let mySelectBoxMemory: SelectBoxMemory = {
    mouseDown: false,
    initialTargetDiv: undefined,
    endTargetDiv: undefined,
    selectedArr: [],
}

export default mySelectBoxMemory