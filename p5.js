/**
* Armory object list
*/
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

class Cell {
  
  /**
  * Cell constructor
  * @param {number} x - The x coordinate on the map.
  * @param {number} y - The y coordinate on the map.
  */
  constructor(x, y) {
    this.blocked = false;
    this.weapon = null;
    this.player = null;
    this.x = x;
    this.y = y;
  }
  
  /**
  * Update vue on HTML using jQuery
  */
  updateHTML() {
    let cell = $("[data-x="+this.x+"][data-y="+this.y+"]");
    
    cell.attr("class", "cell");
    cell.empty(); 
    
    if (this.blocked) {
      cell.addClass("blocked");
    } else {
      cell.addClass("path");
    }
    
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
  
  /**
  * Make distinction between an occupied cell and a blocked cell
  */
  
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
  /**
  * Player constructor
  * @param {number} x - The x coordinate on the map.
  * @param {number} y - The y coordinate on the map.
  * @param {number} index - The index of the player in the array players.
  */
  constructor(x, y, index) {
    this.index = index;
    this.hp = 100;
    this.name = "";
    this.x = x;
    this.y = y;
    this.weapon = {
      type: "fist",
      dmg: 5
    };
    this.action = null;
    // Default statut, replace by attack or defend when there is a fight;
  } 
}

/**
* Naming form submit event (click) handler
* @param {event} click - The event object.
*/
function naming(event){
  event.preventDefault();
  let board = event.data.board;
  let modale = $("#name_choice");
  let namePlayerOne = $('input#name_player-0').val();
  let namePlayerTwo = $('input#name_player-1').val();
  let playerOneDom = $('.player-0');
  let playerTwoDom = $('.player-1');
  board.players[0].name = namePlayerOne;
  board.players[1].name = namePlayerTwo;
  playerOneDom.attr("data-name", namePlayerOne);
  playerTwoDom.attr("data-name", namePlayerTwo);
  console.log(board.players[0].name)
  console.log(board.players[1].name)
  modale.removeClass('pop'); 
}

/**
* Player's move event handler
* @param {event} click - The event object.
*/
function move(event){
  console.log("Start function move()");
  let board = event.data.board;
  if(board.fight){
    return;
  }
  let span = event.currentTarget; 
  let x = span.getAttribute('data-x');
  let y = span.getAttribute('data-y');
  let targetCell = board.map[x][y];
  let currentPlayer = board.getCurrentPlayer();
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
  //si les conditions de combat sont réunis, on affiche une modale de fight, sinon on switch
  if (fight){
    board.startFight();
  } else {
    board.switchCurrentPlayer(); 
  }
}

/**
* Attack event handler
* @param {event} click - The event object.
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
  let victimDom = $('.player-'+ victim.index)
  modale.removeClass('pop');
  
  let dmg = fighter.weapon.dmg;
  
  fighter.action = 'attack';
  if ( victim.action == 'defend'){
    victim.hp = victim.hp-dmg/2;
    infoScore.text('Aïe!' + victim.name + " a pris " + dmg/2 + " dommages!");
    
  }
  else{
    victim.hp = victim.hp - dmg;
    infoScore.text('Aïe!' + victim.name + " a pris " + dmg + " dommages!");
  }
  
  //animation :
  victimDom.addClass('damage').append(bulle);
  setTimeout(() => {  victimDom.removeClass('damage')},500)
  setTimeout(() => {  bulle.remove()},500)
  if ( victim.hp <=0){
    setTimeout(() => {  modaleEnd.addClass('pop')}, 1000)
    setTimeout(() => {  deathNote.text('You are dead '+victim.name); modaleEnd.addClass('pop')}, 1000)
  } else {
    setTimeout(() => {  modaleScore.addClass('pop').append(infoScore); }, 1000)
    setTimeout(() => {  modaleScore.empty() }, 2000)
    setTimeout(() => {  modaleScore.removeClass('pop') }, 2000)
    setTimeout(() => {  board.updateFight(); }, 3000)    
  }
}

/**
* Defend event handler
* @param {event} click - The event object.
*/
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

class Board {
  /**
  * Board constructor
  * @param {number} boardSize - Size of board you want to set
  */
  constructor(boardSize){
    //create a multidimensionnal array containing all the Cell
    this.map = new Array(boardSize);
    //array of player
    this.players = new Array;
    this.currentPlayerIndex = 0;
    this.secondPlayerIndex = 1;
    //Fight status, false by default
    this.fight = false;
    // Method for initialize of the map 
    this.initializeMap();
    this.blockRandomCells(10);
    this.weaponizedRandomCells(5);
    this.playerRandomCells(2);
  }
  
  /**
  * Create a multidimensionnal array (map property of the Board) where each cell is an object Cell
  */  
  initializeMap() {
    for (let x = 0; x < this.boardSize; x++) {
      this.map[x] = new Array(this.boardSize);
      for (let y = 0; y < this.boardSize; y++) {
        this.map[x][y] = new Cell(x, y);
      }
    }
  }
  
  /**
  * Generate a random integer
  * @param {number} max the max value of the random integer you want to generate
  */    
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };
  
  /**
  * Block radnomly n cells on the map
  * @param { Number } qty as many obstacles you want in your map
  */
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
  
  /**
  * Set randomly n weapon on the map
  * @param { Number } qty as many weapon you want on your map
  */
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
  
  /**
  * Set randomly n player on the map
  * @param { Number } qty as many player you want on your map
  */
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
  
  /**
  * Give all the accessible cell on the map based on the cell you pass on the param
  * @param {Cell} startCell base cell to make calculation from
  * @return {array} array of the accessible Cell based on the startCell
  */
  getAccessibleCells(startCell){
    let accessibleCells = new Array;
    for (let x = startCell.x+1 ; x <= startCell.x + 3 ; x++){
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
  
  /**
  * Give the current player 
  * @return {Player} Player object 
  */
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
  
   /**
  * Give the second player 
  * @return {Player} Player object 
  */
  getSecondPlayer(){
    return this.players[this.secondPlayerIndex];
  }
  
  /**
  * Swicth the index of player
  */  
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
  
  /**
  * Give the player's cell
  * @param{number} playerIndex index of the player
  * @return {Cell} player's cell
  */ 
  getPlayerCell(playerIndex) {
    let player = this.players[playerIndex];
    return this.map[player.x][player.y];
  }
  
  /**
  * Check if the players are in fight position (adjacent cell)
  * Update the board.fight status
  * @return {boolean} return the Board.fight status
  */ 
  checkFight(){
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
  
   /**
  * Start the fight
  * Open the fight form screen, (modal)
  */ 
  startFight(){
    console.log('Start function startFigth()');
    //affichage d'une modale indiquant le joueur dont c'est le tour, et le choix entre attaquer ou se défendre:
    let modale = $('#fight');
    let playerName = $('#player_name');
    let currentPlayer = this.getCurrentPlayer();
    modale.addClass('pop'); 
    playerName.text("A toi de jouer "+currentPlayer.name)
    let attackBtn = $('#attack');
    let defendBtn = $('#defend');
    //on appelle ensuite une fonction attack() ou defend() sur l'event "click"
    //on pqsse la board dans un object via le eventData (cf https://api.jquery.com/click/#click-eventData-handler)
    attackBtn.click({board: this}, attack);
    defendBtn.click({board: this}, defend);
  }
  
  /**
  * Update the fight (player status, action and hp)
  * Switch the current player
  * Open the fight form screen (modal)
  */ 
  updateFight(){
    
    console.log('Start function updateFigth()');
    let currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.action == "attack"){
      currentPlayer.action = null;
    } else {
      currentPlayer.action = "defend";
    }
    
    let modale = $('#fight');
    let playerName = $('#player_name');
    
    if (currentPlayer.hp <= 0) {
      return;
    } else {
      this.switchCurrentPlayer();
      let currentPlayer = this.getCurrentPlayer();
      modale.addClass('pop');
      playerName.text("A toi de jouer "+currentPlayer.name)
    }    
  }

    
  /**
  * Get the Board size
  * @return{number}
  */   
  get boardSize() {
    return this.map.length
  }

  /**
  * Create the vue in the browser
  * bind event on the cell
  * open the naming form
  * @return{number}
  */   
  printBoard() {
    let plateau = $('#board'); 
    for (let y = 0; y < this.boardSize; y++) {
      let line = $('<div></div>').addClass('line').attr('line-index', y);
      plateau.append(line);
      
      for (let x = 0; x < this.boardSize; x++) {
        let cell = $('<span></span>').addClass('cell');
        let coordonnate ={
          'data-x': x, 
          'data-y': y
        }
        cell.click({board: this}, move);
        cell.attr(coordonnate);
        line.append(cell);
        this.map[x][y].updateHTML();
      }
    }
    
    let nameChoice = $('#name_choice');
    let form = $("#name_choice");
    setTimeout(() => {  nameChoice.addClass('pop');  }, 1200)
    form.submit({board: this}, naming);
  }
}

$( document ).ready(function() {
  let taille = 10;
  let board = new Board(taille);
  console.log(board.boardSize);
  console.log(board.map[1][2]);
  // No animation :
  // $('#rideau').addClass('slide-up');
  // board.printBoard();
  
  // Introduction animation
  
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