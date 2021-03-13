

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
    } else {
      cell.addClass("path");

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

  // isSelected(){
  //   let cell = $("[data-x="+this.x+"][data-y="+this.y+"]");
  //   cell.dblclick(function(){
  //     console.log(cell);
  //   })
  // }
}

class Player {
  constructor(x, y) {
    //this.name = name;
    this.hp = 10;
    this.x = x;
    this.y = y;
  }

  isSelected(){
    let player = board.map[player.x][player.y];
    player.addEventListener('click', function(){
      console.log(this.x, this.y + "Ce jouer est selectionne");
    })

  }
}

function move(event){
  let board = event.data.board;
  let span = event.target; // ici this == event.target car c'est à lui qu'est bindé l'event click. 
  console.log(span)
  // 1. recuperer la cell js
  let x = span.getAttribute('data-x');
  console.log(x);
  let y = span.getAttribute('data-y');
  console.log(y);
  let targetCell = board.map[x][y];
  console.log(targetCell);
  let currentPlayer = board.getCurrentPlayer();
  console.log(currentPlayer);
  let currentPlayerCell = board.map[currentPlayer.x][currentPlayer.y];
  console.log(currentPlayerCell);
  let accessibleCells = board.getAccessibleCells(currentPlayerCell);
  console.log(accessibleCells);
  if (accessibleCells.indexOf(targetCell) == -1){
    alert("NIQUE TOI");
    return;
  }
  console.log('La cellule est accessible !')
  currentPlayer.x = targetCell.x;
  currentPlayer.y = targetCell.y;
  currentPlayerCell.player = false;
  currentPlayerCell.updateHTML();
  targetCell.player = true;
  targetCell.updateHTML();

  
  // 2. recuperer le joueur courant et sa cell
  // 3. verifier que le joueur peut aller sur la cell cliquee
  // 4. si oui, deplacer joueur dans data JS et update html
  // 4.bis si non, alert action impossible
 }

// Creation d'une class board 
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
      //on balise les boucles pour éviter de sortir de la map et remonter une erreur
      if (x >= this.map.length){
        break;
      }
      let y = startCell.y;
      if(this.map[x][y].blocked == false) {
        accessibleCells.push(this.map[x][y]);
      } else {
        break;
      }
    }
    
    for (let x = startCell.x-1 ; x >= startCell.x - 3 ; x--){
      let y = startCell.y;

      if (x >= this.map.length || x < 0){
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
      if (y >= this.map.length){
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
    return this.players[this.currentPlayerIndex];
  }
  
  getPlayerCell(playerIndex) {
    let player = this.players[playerIndex];
    return this.map[player.x][player.y];
  }
  
  get boardSize() {
    return this.map.length
  }
  

  printBoard() {
    let plateau = $('#board');
    let timeout = 0;
    
    for (let y = 0; y < this.boardSize; y++) {
      // create div line
      let line = $('<div></div>').addClass('line').attr('line-index', y);
      // add line to board
      plateau.append(line);
      
      for (let x = 0; x < this.boardSize; x++) {
        // create span cell
        let cell = $('<span></span>').addClass('cell');
        let coordonnate ={
          'data-x': x, 
          'data-y': y
        }
        
        cell.click({board: this}, move);
        cell.attr(coordonnate);
              
        // add style dedending state of cell
        if (this.map[x][y].blocked){
          cell.addClass('blocked');
        } else {
          cell.addClass('path');
        }
        
        if (this.map[x][y].weapon){
          cell.addClass('weapon');
        }
        
        if (this.map[x][y].player){
          cell.addClass('player');
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
  // board.printLogBoard();
  
  
  $('#rideau').addClass('slide-up');
  board.printBoard();
  
  let cell_current_player = board.getPlayerCell(board.currentPlayerIndex)
   
  // console.log(cell_current_player.x + " " + cell_current_player.y);
  // // cell_current_player.updateHTML();
  
  let accessibleCells = board.getAccessibleCells(cell_current_player);
  console.log(accessibleCells);
  let clickcount = 0;
  

  for(let cell of accessibleCells) {
    $("[data-x="+cell.x+"][data-y="+cell.y+"]").addClass("accessible");
  }
  //   // lE SECRIPT SUIVANT FONCTIONNE MAIS / degueu

  //   $("[data-x="+cell.x+"][data-y="+cell.y+"]").dblclick(function(){
  //     clickcount = clickcount + 1;
  //     console.log('et voici encore' + clickcount + 'click');
  //     $("[data-x=" + cell_current_player.x + "][data-y=" + cell_current_player.y + "]").removeClass('player');
  //     cell_current_player.x = cell.x;
  //     cell_current_player.y = cell.y;
      
  //     $(this).addClass('player');
  //     console.log(cell_current_player.x, cell_current_player.y);
  //     board.currentPlayerIndex = 1;
  //     cell_current_player = board.getPlayerCell(board.currentPlayerIndex)

  //   });
    

  // }
  
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