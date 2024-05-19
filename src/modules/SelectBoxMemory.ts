interface SelectBoxMemory {
    mouseDown: (boolean)
    initialTargetDiv: (HTMLElement | undefined),
    initialTargetDivId: (string | undefined)
    endTargetDiv: (HTMLElement | undefined),
    previousSelected: (HTMLElement[])
}

let mySelectBoxMemory: SelectBoxMemory = {
    mouseDown: false,
    initialTargetDiv: undefined,
    initialTargetDivId: undefined,
    endTargetDiv: undefined,
    previousSelected: [],
}

export default mySelectBoxMemory