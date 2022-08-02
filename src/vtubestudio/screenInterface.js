export class ScreenInterface {
    static findArtMesh (number) {
        let index = number + 1;
        let row = Math.ceil(index / 40);
        let column = index - (40 * (row - 1));

        let artMesh = `A${column}x${row}`;
        return artMesh;
    }
}
