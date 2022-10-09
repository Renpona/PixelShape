export class ScreenInterface {
    // count of times I've forgotten to set this properly: 0
    static productionMode = false;

    static findArtMesh (number) {
        let index = number + 1;
        let row = Math.ceil(index / 40);
        let column = index - (40 * (row - 1));

        // I realized Z was a better prefix, but it's a pain to redo the early demo files that used A
        let artMesh = productionMode ? `Z${column}x${row}` : `A${column}x${row}`;
        return artMesh;
    }
}
