

// CLASS CASE

class Cell {
  constructor(x, y) {
    this.blocked = false;
    this.weapon = false;
    this.player = false;
    this.x = x;
    this.y = y;
  }
}

// Creation d'une class board (exercice)
class Board {
  constructor(boardSize){

    this.map = new Array(boardSize);

    // On appelle la méthode qui permet d'initialiser la map:
    this.initializeMap();
    this.blockRandomCells(10);
    this.weaponizedRandomCells(5);
    this.playerRandomCells(2);
  }

  // La méthode initializeMap crée une map sous forme de tableau multidimensionnel:
  initializeMap() {
    for (let x = 0; x < this.boardSize; x++) {
      this.map[x] = new Array(this.boardSize);
      for (let y = 0; y < this.boardSize; y++) {
        this.map[x][y] = new Cell(x, y);
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
  };

  weaponizedRandomCells(qty) {
    let counter = 0;
    while(counter < qty) {
      let randomX = this.getRandomInt(this.boardSize);
      let randomY = this.getRandomInt(this.boardSize);
      
      // on check si la cellule est deja bloquee
      if (this.map[randomX][randomY].blocked == false && this.map[randomX][randomY].weapon == false) {
        this.map[randomX][randomY].weapon = true;
        counter++;
      }
      else {
        // on est tombe sur une cellule deja bloquee, on recommence.
        continue;
      }
    }
  };

  playerRandomCells(qty) {
    let counter = 0;
    while(counter < qty) {
      let randomX = this.getRandomInt(this.boardSize);
      let randomY = this.getRandomInt(this.boardSize);
      
      // on check si la cellule est deja bloquee
      if (this.map[randomX][randomY].blocked == false && this.map[randomX][randomY].weapon == false && this.map[randomX][randomY].player == false ) {
        this.map[randomX][randomY].player = true;
        counter++;
      }
      else {
        // on est tombe sur une cellule deja bloquee, on recommence.
        continue;
      }
    }
  };

  // return an array of cells accessible from the "start_cell" parameter [Cell object]
  // une fonction qui renvoit un tableau de toutes les cellules praticables,
  //calculées à partir de la variable de type cellule passée en paramètre. 
  
  getAccessibleCells(startCell){
    let accessibleCells = new Array;
    
    for (let x = startCell.x - 3 ; x <= startCell.x + 3 ; x++){
      for (let y = startCell.y - 3 ; y <= startCell.y + 3 ; y++){
        let to_add = false;

        // test current cell
        if (x == startCell.x && y == startCell.y){
          continue;
        }

        // test if blocked
        if (this.map[x][y].blocked == true) {
          continue;
        }
        
        //test if range
        if (x == startCell.x && y <= startCell.y + 3 && y >= startCell.y-3){
          if 
          to_add = true;
        }
        if (y == startCell.y && x <= startCell.x + 3 && y >= startCell.x-3){
          to_add = true;
        } 
        if ((x == startCell.x-1 || x == startCell.x+1)  &&  (y <= startCell.y + 2 && y >= startCell.y-2)){
          to_add = true;
        }
        if ((x == startCell.x-2 || x == startCell.x+2) && (y <= startCell.y + 1 && y >= startCell.y-1)){
          to_add = true;
        }

        if(to_add == true) {
          accessibleCells.push(this.map[x][y]);
        }

      }
    }

    //parcours des cells alentours et check si accessble

    return accessibleCells;
  }

  get boardSize() {
    return this.map.length
  }

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

  printBoard() {
    let plateau = $('#board');
    let timeout = 0;
  
    for (let y = 0; y < this.boardSize; y++) {
      // create div line
      let line = $('<div></div>').addClass('line').attr('line-index', y);
      // add data attribute 
      

      // add line to board
      plateau.append(line);

      for (let x = 0; x < this.boardSize; x++) {
         // create span cell
         let cell = $('<span></span>').addClass('cell');
         let coordonnate ={
          'data-x': x, 
          'data-y': y
        }
        cell.attr(coordonnate);

        // add style dedending state of cell
        if (this.map[x][y].blocked){
          cell.addClass('blocked');
        }

        else if (this.map[x][y].weapon){
          cell.addClass('weapon');
        }

        else if (this.map[x][y].player){
          cell.addClass('player' + ' ' + 'path');
        }

        else {
          cell.addClass('path');
        }
        
        // add cell to line
        line.append(cell);
        //setTimeout(() => { line.append(cell); }, timeout);
        //timeout += 20;
      }
    }
  }
}




$( document ).ready(function() {
  let taille = 10;
  let board = new Board(taille);
  console.log(board.boardSize);
  console.log(board.map[1][2]);

  
  board.printLogBoard();
  
  $('#rideau').addClass('slide-up');
  board.printBoard();
  
  let start = board.map[3][3];
  let accessibleCells = board.getAccessibleCells(start);
  for(let cell of accessibleCells) {
    $("[data-x="+cell.x+"][data-y="+cell.y+"]").addClass("accessible")
  }

  //board.showAccessible(accessibleCells);

  $('#go').mouseenter(function(){
    $(this).addClass('shine')
  });

  $('#go').mousedown(function(){
    $(this).removeClass('shine')
  });

  $('#go').mouseup(function() {
    $(this).addClass('active'),
    
    setTimeout(() => {  $('#rideau').addClass('slide-up'); }, 1700),
    setTimeout(() => {  board.printBoard();  }, 2000)

  });


});