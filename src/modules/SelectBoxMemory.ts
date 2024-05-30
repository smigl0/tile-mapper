/**
 * Selectbox memory, shared for all other modules.
 */

interface SelectBoxMemory {
    mouseDown: (boolean)
    initialTargetDiv: (HTMLDivElement | undefined),
    endTargetDiv: (HTMLDivElement | undefined),
    selectedArr: (HTMLButtonElement[]),
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