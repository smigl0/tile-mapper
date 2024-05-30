/**
 * Selectbox memory, shared for all other modules.
 * @typedef {Object} SelectBoxMemory
 * @property {boolean} mouseDown - Indicates if the mouse is currently pressed down.
 * @property {HTMLDivElement | undefined} initialTargetDiv - The initial target div element when selection starts.
 * @property {HTMLDivElement | undefined} endTargetDiv - The target div element where selection ends.
 * @property {HTMLButtonElement[]} selectedArr - Array of selected button elements.
 * @property {string} selectionMode - The mode of selection.
 */

interface SelectBoxMemory {
    mouseDown: boolean,
    initialTargetDiv: HTMLDivElement | undefined,
    endTargetDiv: HTMLDivElement | undefined,
    selectedArr: HTMLButtonElement[],
    selectionMode: string
}

/**
 * Instance of SelectBoxMemory to maintain the state of the select box.
 * @type {SelectBoxMemory}
 */

let mySelectBoxMemory: SelectBoxMemory = {
    mouseDown: false,
    initialTargetDiv: undefined,
    endTargetDiv: undefined,
    selectedArr: [],
    selectionMode: ""
}

export type { mySelectBoxMemory, SelectBoxMemory }
export default mySelectBoxMemory