game.PlayScreen = me.ScreenObject.extend({
  /**
   *  action to perform on state change
   */
  onResetEvent: function() {
    // load a level
    me.levelDirector.loadLevel(game.data.current_level);

    // add our HUD to the game world
    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);

    me.audio.playTrack("DST-InertExponent");
  },

  /**
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    // remove the HUD from the game world
    me.game.world.removeChild(this.HUD);
    me.audio.stopTrack();
  }
});
