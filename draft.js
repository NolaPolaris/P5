// CLASS CASE

class Cell {
    constructor() {
      this.blocked = false;
      //this.weapon = "weapon-none"; or 
    }
  }

const boardSize = 10;

var board = new Array(boardSize);

for (x=0; x<boardSize; x++) {
  board[x] = new Array(boardSize);
  for (y=0; y<boardSize; y++){
      board[x][y] = new Cell();
  }
}


// ------------------------------------------------------------------------------------------------


// CONSTRUCTION DU PLATEAU DE JEU 

const boardSize = 10;

// Construction d'un premier tableau vide dont la lentgh = boardSize, en mode constructeur 


let x = new Array[boardSize];

// Pour chaque entrée du tableau x, on attribut un nouveau tableau égal à boardSize

for (i=0; i<x.length; i++) {
    x[i] = new Array(boardSize);
}

// Creation d'une class board (exercice)

class Board {
  constructor(x, y){
    this.x = x;
    this.y = y;

    this.area = null;
  }
 
  calcArea() {
    if (this.area != null) {
      return this.area
    }
    else{
      this.area = this.x * this.y
      return this.area
    }
  }
}
let boardSize = 10
let board = new Board(boardSize, boardSize);
let plateau = new Board(5, 5);

boardSize = 30;
let area = board.calcArea();
let aire = plateau.calcArea();

var cell = map[1][2];
// Obtenir des coordonnes random:

getRandom = function(max) {
    return Math.floor(Math.random() * Math.floor(max)) + Math.floor(Math.random() * Math.floor(max))
}

var randomCell = map[getRandom(map_size)][getRandom(map_size)];
randomCell.blocked = true;


// On cree ensuite objet case 

//var Object = new Object();

// cqse peut etre etape ou obstacle
//      etape peut avoir un bonus : arme
//chemin = toutes les cases etape pratiquables par tours. 
// case = arrayElement;
// if case = true {
//     for i in (i <= 3, i=coordonnee, i++)

// }

