// praticable  --> le jouer peut se déplacer
let praticablePath = new Array;

const getA = function(){
  if (x == 3 && y <= 6){
    praticablePath.push(map[x][y]);
  }

  else if (x == 2 && y >=1 &&  y <= 5){
    praticablePath.push(cell);
  }

  else if (cell.x == 1 && cell.y >=2 &&  cell.y <= 4){
    praticablePath.push(cell);
  }

  else if (cell.x == 0 && cell.y == 3 ){
    praticablePath.push(cell);
  }

  else {
    continue;
  }
  
}



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


// adjacentCell une par une = trop long

if (board.map[targetCell.x+1][targetCell.y].player!=null && board.map[targetCell.x+1][targetCell.y].player.index!=currentPlayer){
  console.log("combat X+1");
  console.log(targetCell);
  modale.addClass('pop');
}

if (board.map[targetCell.x-1][targetCell.y].player!=null && board.map[targetCell.x-1][targetCell.y].player.index!=currentPlayer){
  console.log("combat X-1");
  console.log(targetCell);
  modale.addClass('pop');
}

if (board.map[targetCell.x][targetCell.y+1].player!=null && board.map[targetCell.x][targetCell.y+1].player.index!=currentPlayer){
  console.log("combat y+1");
  console.log(targetCell);
  modale.addClass('pop');
}

if (board.map[targetCell.x][targetCell.y-1].player!=null && board.map[targetCell.x][targetCell.y-1].player.index!=currentPlayer){
  console.log("combat y1");
  console.log(targetCell);
  modale.addClass('pop');
}

else{
  console.log("peace");
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

// Print map dans la consKole 

printLogBoard() {
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