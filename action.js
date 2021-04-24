
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
