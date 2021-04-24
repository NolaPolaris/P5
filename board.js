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
      if (!this.map[randomX][randomY].isOccupied()) {
        this.players[counter] = new Player(randomX, randomY, counter);
        this.map[randomX][randomY].player = this.players[counter];
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
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x-1 && secondPlayer.y == currentPlayer.y){
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x && secondPlayer.y == currentPlayer.y+1){
      this.fight = true;
    } 
    if (secondPlayer.x == currentPlayer.x && secondPlayer.y == currentPlayer.y-1){
      this.fight = true;
    }
    return this.fight;
  }
  
   /**
  * Start the fight
  * Open the fight form screen, (modal)
  */ 
  startFight(){
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
