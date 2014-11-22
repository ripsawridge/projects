/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

  init: function() {
    // call the constructor
    this._super(me.Container, 'init');
    
    // persistent across level change
    this.isPersistent = true;
    
    // non collidable
    this.collidable = false;
    
    // make sure our object is always draw first
    this.z = Infinity;

    // give a name
    this.name = "HUD";
    
    // add our child score object at the lower right corner
    this.addChild(new game.HUD.ScoreItem(230, 440));
  }
});


/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({	
  /** 
   * constructor
   */
  init: function(x, y) {
		
    // call the parent constructor 
    // (size does not matter here)
    this._super(me.Renderable, 'init', [x, y, 10, 10]); 

    this.font = new me.BitmapFont("32x32_font", 32);
    this.font.set("right");

    // local copy of the global score
    this.score = -1;

    // local copy of the lives
    this.lives = -1;

    this.coinsNotCollected = -1;

    // make sure we use screen coordinates
    this.floating = true;
  },

  /**
   * update function
   */
  update : function () {
    // we don't do anything fancy here, so just
    // return true if the score has been updated
    if (this.score !== game.data.score ||
        this.lives !== game.data.lives ||
        this.coinsNotCollected != game.data.coinsNotCollected) {
      this.score = game.data.score;
      this.lives = game.data.lives;
      this.coinsNotCollected = game.data.coinsNotCollected;
      return true;
    }
    return false;
  },

  /**
   * draw the score
   */
  draw : function (context) {
    this.font.draw(context, game.data.coinsNotCollected, this.pos.x, this.pos.y);
    this.font.draw(context, game.data.score, this.pos.x + 400, this.pos.y);
    this.font.draw(context, game.data.lives, this.pos.x + 200, this.pos.y);
  }

});
