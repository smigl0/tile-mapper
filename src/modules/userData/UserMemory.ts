interface UserMemory {
    currentDataString: string
    selectedCanvasTileId: (number|undefined)
    selectedCanvasTileIdPrevious: (number|undefined)
}

let myUserMemory: UserMemory = {
    currentDataString:'',
    selectedCanvasTileId:undefined,
    selectedCanvasTileIdPrevious:undefined
}

console.log(myUserMemory);

export default myUserMemory