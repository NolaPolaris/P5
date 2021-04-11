let armory = [
  {
    type: "firegun",
    dmg : 25
  },
  {
    type: "shovel",
    dmg : 20
  },
  {
    type: "rock",
    dmg : 15
  },
  {
    type: "rope",
    dmg : 5
  }
]

// CLASS CASE

class Cell {
  constructor(x, y) {
    this.blocked = false;
    this.weapon = null;
    this.player = null;
    this.x = x;
    this.y = y;
  }
  
  updateHTML() {
    let cell = $("[data-x="+this.x+"][data-y="+this.y+"]");

    cell.attr("class", "cell");
    cell.empty(); 

    if (this.blocked) {
      cell.addClass("blocked");
    } else {
      cell.addClass("path");
    }

    // Avec les Weapon Enrichie :
    if (this.weapon != null) {
      let weapon = $("<span></span>").addClass(this.weapon.type);
      cell.addClass("weapon");
      cell.append(weapon);
    }  

    if (this.player != null) {
      let player = $("<span></span>").addClass("player-" + this.player.index);
      let weapon = $("<span></span>").addClass(this.player.weapon.type);
      cell.append(player);
      player.append(weapon);
      
    }
  }

  animHTML(){
    let player = $("<span></span>").addClass("player-" + this.player.index);
    player.addClass("move");
  }
  // faire la distinction entre obstacle et occupée (par une arme ou un joueur)
  isOccupied() {

    if (this.blocked || this.weapon != null || this.player != null) {
      return true;
    }
    else {
      return false;
    }
  }

}

class Player {
  constructor(x, y, index) {
    //this.name = name;
    this.index = index;
    this.hp = 100;
    this.x = x;
    this.y = y;
    this.weapon = {
      type: "fist",
      dmg: 50
    };
    this.action = null;
    // Statut : attaquant, défenseur, ou attaqué 
    // On attribut ce statut en fonction de la réponse à la valeur de la checkbox affichée lors de la confrontation
  }
}

function move(event){
  console.log("Start function move()");
  let board = event.data.board;
  if(board.fight){
    return;
  }
  let span = event.currentTarget; // ici this == event.target car c'est à lui qu'est bindé l'event click. target != cureentTarget !
  console.log(span)
  // 1. recuperer la cell js
  let x = span.getAttribute('data-x');
  let y = span.getAttribute('data-y');
  // la cell sur laquerlle le joueur souhaite aller:
  let targetCell = board.map[x][y];
  // l'index du joueur courrant :
  let currentPlayer = board.getCurrentPlayer();
  // let secondPlayer = board.getSecondPlayer();
  // La cellule sur laquelle se trouve le joueur :
  let currentPlayerCell = board.map[currentPlayer.x][currentPlayer.y];
 
  // On regarde quelles cellules sont accessibles :
  let accessibleCells = board.getAccessibleCells(currentPlayerCell);  
  if (accessibleCells.indexOf(targetCell) == -1){
    alert("Not accessible!");
    return;
  }
  // si la cellule de destination contient une arme, on passe cette arme au joueur et on vide la cellule :   
  if (targetCell.weapon != null){
    let currentWeapon = currentPlayer.weapon;
    console.log("arme de la cellule est :")
    let newWeapon = targetCell.weapon;
    console.log('arme du joueur')
    currentPlayer.weapon = newWeapon;
    if (currentWeapon.type != "fist"){
      targetCell.weapon = currentWeapon;
    }
    else{
      targetCell.weapon = null;
    }
  }
  // On enregistre ensuite les nouvelles coordonnées du joueur, ses propriétés et on les passe à la cellule de destination :
  currentPlayer.x = targetCell.x;
  currentPlayer.y = targetCell.y;  
  currentPlayerCell.player = null;
  currentPlayerCell.updateHTML();
  // on passe en propriété player de la cellule un objet player :
  targetCell.player = currentPlayer;
  targetCell.updateHTML();
  fight = board.checkFight();
  //si fight => affiche modale de fight
  if (fight){
    board.startFight();
  } else {
    board.switchCurrentPlayer(); 
  }
}

/*
$("#board").on("keydown", ".player", function(event){

  if(event.key == fleche du haut ou Z){
    $(this).move()
    this.compteurMove++;
  }

});
*/
  
function attack(event){
    console.log('Start function attack()');
    event.preventDefault();
    let modale = $('#fight');
    let modaleScore = $('#score');
    let infoScore = $('<p></p>');
    let modaleEnd = $('#end');
    let deathNote = $('#player_dead')
    let bulle = $('<span></span>').addClass('bulle');
    let board = event.data.board;
    let fighter = board.getCurrentPlayer();
    let victim = board.getSecondPlayer();
    let fighterDom = $('.player-'+ fighter.index);
    let victimDom = $('.player-'+ victim.index)
    modale.removeClass('pop');

    let dmg = fighter.weapon.dmg;

    fighter.action = 'attack';
    if ( victim.action == 'defend'){
      victim.hp = victim.hp-dmg/2;
      infoScore.text('Aïe! Player-' + victim.index + " a pris " + dmg/2 + " dommages!");

    }
    else{
      victim.hp = victim.hp - dmg;
      infoScore.text('Aïe! Player-' + victim.index + " a pris " + dmg + " dommages!");
    }


       
    //animation :
    victimDom.addClass('damage').append(bulle);
    setTimeout(() => {  victimDom.removeClass('damage')},500)
    setTimeout(() => {  bulle.remove()},500)
    if ( victim.hp <=0){
      setTimeout(() => {  modaleEnd.addClass('pop')}, 1000)
      setTimeout(() => {  deathNote.text('youre dead player-'+victim.index); modaleEnd.addClass('pop')}, 1000)
    } else {
      setTimeout(() => {  modaleScore.addClass('pop').append(infoScore); }, 1000)
      setTimeout(() => {  modaleScore.empty() }, 2000)
      setTimeout(() => {  modaleScore.removeClass('pop') }, 2000)
      setTimeout(() => {  board.updateFight(); }, 3000)    
    }
    }
   

function defend(event){
  console.log('Start function defend()');
  console.log('la function defend')
  let board = event.data.board;
  let fighter = board.players[board.currentPlayerIndex];
  let victim = board.players[board.secondPlayerIndex];
  fighter.action = 'defend';
  console.log("start action defend" +  fighter.action);
  board.updateFight()
}


// Creation d'une class board 
class Board {
  constructor(boardSize){
    
    //map = tableau multidimentionel contenant l'ensemble des cellules du plateau
    this.map = new Array(boardSize);
    //players = tableau contenant les joueurs (objet de type Player)
    this.players = new Array;
    this.currentPlayerIndex = 0;
    this.secondPlayerIndex = 1;
    this.fight = false;
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
        this.map[randomX][randomY].weapon = armory[counter];
        console.log(armory[counter])
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
        this.players[counter] = new Player(randomX, randomY, counter);
        this.map[randomX][randomY].player = this.players[counter];
        console.log("Voici l'index du player")
        console.log(this.players[counter].index)
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
      if(this.map[x][y].blocked == false && this.map[x][y].player==null) {
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
      
      if(this.map[x][y].blocked == false && this.map[x][y].player==null) {
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
      if(this.map[x][y].blocked == false && this.map[x][y].player==null) {
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
      if(this.map[x][y].blocked == false && this.map[x][y].player==null) {
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

  getSecondPlayer(){
    return this.players[this.secondPlayerIndex];
  }
  
  switchCurrentPlayer(){
    console.log("start Switch")
    if(this.currentPlayerIndex == 0){
      this.currentPlayerIndex = 1;
      this.secondPlayerIndex = 0;
    }else{
      this.currentPlayerIndex = 0;
      this.secondPlayerIndex = 1;
    }
  }

  getPlayerCell(playerIndex) {
    let player = this.players[playerIndex];
    return this.map[player.x][player.y];
  }

  checkFight(){
    console.log('Start function checkFigth()');
    let currentPlayer = this.getCurrentPlayer();
    let secondPlayer = this.getSecondPlayer();
    this.fight = false;
    if (secondPlayer.x == currentPlayer.x+1 && secondPlayer.y == currentPlayer.y){
      console.log("combat X+1");
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x-1 && secondPlayer.y == currentPlayer.y){
      console.log("combat X-1");
    
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x && secondPlayer.y == currentPlayer.y+1){
      console.log("combat y+1");
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x && secondPlayer.y == currentPlayer.y-1){
      console.log("combat y-1");
      this.fight = true;
    }
    return this.fight;
  }

  startFight(){
    console.log('Start function startFigth()');
    let modale = $('#fight');
    let playerName = $('#player_name');
    let currentPlayer = this.getCurrentPlayer();
    modale.addClass('pop'); 
    playerName.text("A toi de jouer player-"+currentPlayer.index)
    let attackBtn = $('#attack');
    let defendBtn = $('#defend');
    attackBtn.click({board: this}, attack);
    defendBtn.click({board: this}, defend);
  }

  updateFight(){
    
    console.log('Start function updateFigth()');
    let currentPlayer = this.getCurrentPlayer();
    let secondPlayer = this.getSecondPlayer();
    console.log(currentPlayer.action);
    console.log(secondPlayer.action);
    if (currentPlayer.action == "attack"){
      currentPlayer.action = null;
    } else {
      currentPlayer.action = "defend";
    }

    let modale = $('#fight');
    let modaleEnd =  $('#end');
    let deathNote = $('#player_dead');
    let playerName = $('#player_name');

    if (currentPlayer.hp <= 0) {
      return;
    } else {
    this.switchCurrentPlayer();
    let currentPlayer = this.getCurrentPlayer();
    let secondPlayer = this.getSecondPlayer();
    modale.addClass('pop');
    playerName.text("A toi de jouer player-"+currentPlayer.index)
    }

    
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
        // add cell to line
        line.append(cell);
        this.map[x][y].updateHTML();
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

  //A GARDER Animation introduction
  
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