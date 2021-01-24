
class Cell {
    constructor() {
      this.blocked = false;
      //this.weapon = "weapon-none"; or 
    }
  }

const map_size = 10;

var map = new Array(map_size);

for (x=0; x<map_size; x++) {
    map[x] = new Array(map_size);
    for (y=0; y<map_size; y++){
        map[x][y] = new Cell();
    }
}

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

