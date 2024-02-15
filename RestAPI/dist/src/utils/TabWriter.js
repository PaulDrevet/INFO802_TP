"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TabWriter {
    output = '';
    // Ajoute une cellule au format tabulaire
    writeCell(cell, width) {
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
exports.default = TabWriter;
