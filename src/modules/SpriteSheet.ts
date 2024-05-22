import SpritePaletteTile from "./SpritePaletteTile";

export default class SpriteSheet {

    // public spritesArray: string[][] = [];
    public targetDiv: HTMLElement;
    public undoMemory: object[] = new Array<object>(10)

    private spriteWidth: number = 0;
    private spriteHeight: number = 0;


    constructor(
        targetDiv: HTMLElement,
    ) {
        this.targetDiv = targetDiv
    }

    loadImage(
        pathToImg: string = './src/img/SNES - Final Fantasy 6 - Zozo Tiles.png',
        xTiles: number = 16,
        yTiles: number = 16,
        spritesPerRow?: number
    ) {

        let img = new Image();

        let spritesArray: string[][] = [];

        for (let y = 0; y < yTiles; y++) {
            spritesArray.push([]);
        }

        img.onload = () => {
            // spriteSplitter
            //console.log(img.height);
            //console.log(img.width);

            this.spriteWidth = Number(img.width / xTiles);
            this.spriteHeight = Number(img.height / yTiles);

            //console.log(this);


            var canvas = document.createElement("canvas");
            canvas.width = this.spriteWidth;
            canvas.height = this.spriteHeight;

            var ctx = canvas.getContext("2d");

            for (let y = 0; y < yTiles; y++) {
                for (let x = 0; x < xTiles; x++) {
                    ctx?.clearRect(0, 0, this.spriteWidth, this.spriteHeight);
                    ctx?.drawImage(img, (x * this.spriteWidth), (y * this.spriteHeight), canvas.width, canvas.width, 0, 0, canvas.width, canvas.width);

                    spritesArray[y].push(canvas.toDataURL());
                }

            }

            // spriteAside generator

            let spritePerRowCounter = 0;

            if (typeof spritesPerRow == "undefined") {
                spritesPerRow = xTiles
            }


            spritesArray.forEach((spriteRow) => {
                let spriteRowDiv = document.createElement('div');
                spriteRowDiv.classList.add('spriteTr');

                spriteRow.forEach(sprite => {

                    let imgTile = new SpritePaletteTile(sprite)


                    spriteRowDiv.append(imgTile.spriteDiv);

                    spritePerRowCounter++

                    if (spritePerRowCounter == spritesPerRow) {
                        this.targetDiv?.append(spriteRowDiv);
                        spriteRowDiv = document.createElement('div');
                        spriteRowDiv.classList.add('spriteTr');
                        spritePerRowCounter = 0
                    }
                });
            });

        };

        img.src = pathToImg;

    }

}
