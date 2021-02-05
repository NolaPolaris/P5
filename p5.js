// CLASS CASE

class Cell {
  constructor() {
    this.blocked = false;
    //this.weapon = "weapon-none"; or 
  }
}

// Creation d'une class board (exercice)
class Board {
  constructor(boardSize){

    this.map = new Array(boardSize);
    
    for (let x = 0; x < this.map.length; x++) {
      this.map[x] = new Array(boardSize);
        for (let y = 0; y < boardSize; y++){
            this.map[x][y] = new Cell();
        }
    }
  }

  get boardSize() {
    return this.map.length
  }

  printBoard() {
    for (let y = 0; y < this.boardSize; y++) {
      let line = "";
      for (let x = 0; x < this.boardSize; x++) {
        if (this.map[x][y].blocked){
          line += "[ X ]";
        }
        else {
          line += `[${x},${y}]`
        }
      }
      console.log(line);
    }
  }
}

let taille = 10;
let board = new Board(taille);
console.log(board.boardSize);
console.log(board.map[1][2])
board.printBoard();