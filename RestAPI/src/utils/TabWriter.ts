export default class TabWriter {
    private output: string = '';

    // Ajoute une cellule au format tabulaire
    writeCell(cell: string, width: number) {
        this.output += cell + '\t'.repeat(width - cell.length);
    }

    // Ajoute une ligne au format tabulaire
    writeLine() {
        this.output += '\n';
    }

    // Récupère la sortie formatée
    toString() {
        return this.output;
    }
}