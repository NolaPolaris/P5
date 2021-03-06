

// CLASS CASE

class Cell {
  constructor(x, y) {
    this.blocked = false;
    this.weapon = false;
    this.player = false;
    this.x = x;
    this.y = y;
  }
  
  updateHTML() {
    let cell = $("[data-x="+this.x+"][data-y="+this.y+"]");
    cell.attr("class", "cell");
    if (this.blocked) {
      cell.addClass("blocked");
    }
    if (this.weapon) {
      cell.addClass("weapon");
    }
    if (this.player) {
      cell.addClass("player");
    }
  }
  
  // faire la distinction entre obstacle et occupée (par une arme ou un joueur)
  isOccupied() {
    if (this.blocked || this.weapon || this.player) {
      return true;
    }
    else {
      return false;
    }
  }
}

class Player {
  constructor(x, y) {
    //this.name = name;
    this.hp = 10;
    this.x = x;
    this.y = y;
  }
}

// Creation d'une class board (exercice)
class Board {
  constructor(boardSize){
    
    //map = tableau multidimentionel contenant l'ensemble des cellules du plateau
    this.map = new Array(boardSize);
    //players = tableau contenant les joueurs (objet de type Player)
    this.players = new Array;
    this.currentPlayerIndex = 0;
    
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
    }
  };
  
  weaponizedRandomCells(qty) {
    let counter = 0;
    while(counter < qty) {
      let randomX = this.getRandomInt(this.boardSize);
      let randomY = this.getRandomInt(this.boardSize);
      
      // on check si la cellule est deja bloquee
      if (!this.map[randomX][randomY].isOccupied()) {
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
      console.log(randomX, randomY, !this.map[randomX][randomY].isOccupied(), counter)
      if (!this.map[randomX][randomY].isOccupied()) {
        this.map[randomX][randomY].player = true;
        this.players[counter] = new Player(randomX, randomY);
        counter++;
      }
      else {
        // on est tombe sur une cellule deja bloquee, on recommence.
        continue;
      }
    }
  };
  
  // return an array of cells accessible from the "start_cell" parameter [Cell object]
  getAccessibleCells(startCell){
    let accessibleCells = new Array;
    
    for (let x = startCell.x+1 ; x <= startCell.x + 3 ; x++){
      //on balise les boucles pour éviter de sortir de la map et remonhter une erreur

      if (x >= this.map.length-1){
        break;
      }

      //on peut aussi utiliser cette manière d'écrire, ou intégrer cette condition dans le second argument de notre boucle for:

      // if (this.map.length <= x){
      //   break;
      // }

      let y = startCell.y;
      
      if(this.map[x][y].blocked == false) {
        accessibleCells.push(this.map[x][y]);
      } else {
        break;
      }
    }
    
    for (let x = startCell.x-1 ; x >= startCell.x - 3 ; x--){
      let y = startCell.y;

      if (x >= this.map.length-1 || x < 0){
        break;
      }
      
      if(this.map[x][y].blocked == false) {
        accessibleCells.push(this.map[x][y]);
      } else {
        break;
      }
    };

    for (let y = startCell.y+1 ; y <= startCell.y + 3 ; y++){
      let x = startCell.x;
      if (y >= this.map.length-1){
        break;
      }
      if(this.map[x][y].blocked == false) {
        accessibleCells.push(this.map[x][y]);
      } else {
        break;
      }
    };

    for (let y = startCell.y-1 ; y >= startCell.y - 3 ; y--){
      let x = startCell.x;
      if (y >= this.map.length-1 || y < 0){
        break;
      }
      if(this.map[x][y].blocked == false) {
        accessibleCells.push(this.map[x][y]);
      } else {
        break;
      }
    };
    return accessibleCells;
  } 
  
  getCurrentPlayer() {
    return this.players(this.currentPlayerIndex);
  }
  
  getPlayerCell(playerIndex) {
    let player = this.players[playerIndex];
    return this.map[player.x][player.y];
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
  
  // à revoir : block la cellule du currentPlayer :
  
  let cell_current_player = board.getPlayerCell(board.currentPlayerIndex)
  console.log(cell_current_player);
  // console.log(cell_current_player.x + " " + cell_current_player.y);
  // cell_current_player.blocked = true;
  // // cell_current_player.updateHTML();
  
  // let start = cell_current_player;
  let accessibleCells = board.getAccessibleCells(cell_current_player);
  console.log(accessibleCells);
  for(let cell of accessibleCells) {
    $("[data-x="+cell.x+"][data-y="+cell.y+"]").addClass("accessible")
  }
  
  //board.showAccessible(accessibleCells);
  
  // Animation introduction
  
  // $('#go').mouseenter(function(){
  //   $(this).addClass('shine')
  // });
  
  // $('#go').mousedown(function(){
  //   $(this).removeClass('shine')
  // });
  
  // $('#go').mouseup(function() {
  //   $(this).addClass('active'),
  
  //   setTimeout(() => {  $('#rideau').addClass('slide-up'); }, 1700),
  //   setTimeout(() => {  board.printBoard();  }, 2000)
  
  // });
  
  
});