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
