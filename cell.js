
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
