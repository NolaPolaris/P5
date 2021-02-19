$( document ).ready(function() {
  $('#go').mouseenter(function(){
    $(this).addClass('shine')
  });

  $('#go').mousedown(function(){
    $(this).removeClass('shine')
  });

  $('#go').mouseup(function() {
    $(this).addClass('active'),
    
    setTimeout(() => {  $('#rideau').addClass('slide-up'); }, 1700),
    setTimeout(() => {  $('#board').addClass('flip-horizontal-bottom'); }, 2000)
    
  });
});



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

    // On appelle la méthode qui permet d'initialiser la map:
    this.initializeMap();
    this.blockRandomCells(10);
  }

  // La méthode initializeMap crée une map sous forme de tableau multidimensionnel:
  initializeMap() {
    for (let x = 0; x < this.boardSize; x++) {
      this.map[x] = new Array(this.boardSize);
      for (let y = 0; y < this.boardSize; y++) {
        this.map[x][y] = new Cell();
      }
    }
  }

  // Génération d'un entier aléatoire :
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  // Bloque 10 cellules choisis aleatoirement. 
  // Attribution d'index aléatoire selon les conditions suivantes : les index doivbent toujours être différents les uns des autres,
  // les entiers qui les constituent ne doivent pas dépasser 10 (nombre de cases "obastacles")
  blockRandomCells(qty) {
    let counter = 0;
    while(counter < qty) {
      let randomX = this.getRandomInt(this.boardSize);
      let randomY = this.getRandomInt(this.boardSize);
      
      // on check si la cellule est deja bloquee
      if (this.map[randomX][randomY].blocked == false) {
        this.map[randomX][randomY].blocked = true;
        counter++;
      }
      else {
        // on est tombe sur une cellule deja bloquee, on recommence.
        continue;
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