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
    this.index = index;
    this.hp = 100;
    this.name = "";
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

function naming(event){
  event.preventDefault();
  console.log("Start function naming()");
  let board = event.data.board;
  
  let modale = $("#name_choice");
  let inputOne =  $('#name_player-0');
  let inputTwo = $('#name_player-1');

  // if (!inputOne.validity.valid === true || !inputTwo.validity.valid === true ){
  //   modale.addClass('wrong');
  //   return;
  // }

  // else {
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
  // }  
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
    // on enregistre un entier pour distinguer le joueur courant, et le joueur secondaire:
    this.currentPlayerIndex = 0;
    this.secondPlayerIndex = 1;
    //on ajoute un statut "fight", dont la valeur par défaut est "false":
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
  // Attribution d'index aléatoire selon les conditions suivantes : les index doivent toujours être différents les uns des autres,
  // on passe en paramètre un variable (qty) qui pourra être modifiée si l'on souhaite ajouter + ou - d'obstacles, d'armes ou de joueurs
 
  /**
 * Block or place n cells / weapon / players you want randomly on the map
 * @param { Number } number as many obstacles/weapon/players you want in your map
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
  
  // On crée une fonction qui retourne un array des différentes cellules accessibles
  // depuis une cellule de départ passée en paramètre de la fonction

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
  // Deux fonctions permettant de connaître l'index des joueurs :
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getSecondPlayer(){
    return this.players[this.secondPlayerIndex];
  }
  
  // fonction qui permet de switcher le statut du joueur à chaque tour:
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

  //fonction permettant d'obtenir la cellule du joueur dont on passe l'index en paramètre:

  getPlayerCell(playerIndex) {
    let player = this.players[playerIndex];
    return this.map[player.x][player.y];
  }

  //Fonction permettant de vérifier si les conditions sont remplies pour qu'il y ait un combat
  //(si les deux joueurs sont dsur des cellules adjacentes, horizontales ou verticales):
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

  //Fonction qui lance le combat dès que les conditions de fights sont remplies:

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
    //on appelle ensuite une fonction attack() ou defend() sur l'event "click",
    // et on précise en paramètre que this renverra à l'objet board, (plutôt qu'au handler de l'event) afin d'accéder aux différentes méthodes et fonctions:
    attackBtn.click({board: this}, attack);
    defendBtn.click({board: this}, defend);
  }

  //unpdateFight() nous permet de clôturer un tour, de mettre à jour le statut des joueurs
  //(PV et statut) et de switcher les joueurs:
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
    let playerName = $('#player_name');

    //si les PV du joueurs sont inférieurs ou égaux à 0, le combat est fini
    // donc on sort de la fonction, sinon, on renvoit une modale de choix:
    if (currentPlayer.hp <= 0) {
      return;
    } else {
    this.switchCurrentPlayer();
    let currentPlayer = this.getCurrentPlayer();
    modale.addClass('pop');
    playerName.text("A toi de jouer "+currentPlayer.name)
    }    
  }
  
// obtenir la taille du plateau de jeu :
  get boardSize() {
    return this.map.length
  }
//Afficher le plateau de jeu dans le HTML:
  printBoard() {
    let plateau = $('#board'); 
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
        // setTimeout(() => { line.append(cell); }, timeout);
        // timeout += 20;
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
  // Sans animation de début :
  // $('#rideau').addClass('slide-up');
  // board.printBoard();
  
  //A GARDER Animation introduction
  
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