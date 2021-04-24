
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