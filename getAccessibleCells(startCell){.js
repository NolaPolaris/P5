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
  };