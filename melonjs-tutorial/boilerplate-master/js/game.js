
/* Game namespace */
var game = {

  // an object where to store game information
  data : {
    // score
    score : 0,
    // number of lives
    lives : 3,
    // This is programmatically determined on level loads.
    coinsNotCollected : 0,
    collectedCoins : [],
    // current level
    current_level: "area03",
    // reset function
    "reset" : function() {
      this.score = 0;
      this.lives = 3;
      this.current_level = "area01";
      this.coinsNotCollected = 0;
      this.collectedCoins = [];
    }
  },
	
	
  // Run on page load.
  "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen",  me.video.CANVAS, 640, 480, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      window.onReady(function () {
	me.plugin.register.defer(this, debugPanel, "debug");
      });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Set a callback for level loads too.
    me.game.onLevelLoaded = this.levelLoaded.bind(this);

    // We need to prevent level collisions if you don't have enough
    // coins.
    this.oldShouldCollide = me.collision.shouldCollide;
    me.collision.shouldCollide = this.shouldCollide.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

  // Run on game resources loaded.
  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // global state transition effect.
    me.state.transition("fade","#FFFFFF", 250);

    me.pool.register("mainPlayer", game.PlayerEntity);
    me.pool.register("CoinEntity", game.CoinEntity);
    me.pool.register("EnemyEntity", game.EnemyEntity);
    
    me.input.bindKey(me.input.KEY.LEFT, "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.X, "jump", true);

    // Start the game.
    me.state.change(me.state.MENU);
  },

  "levelLoaded" : function(levelName) {
    // Discover the number of coins that need to be collected to successfully
    // exit the level.
    var coins = me.game.world.getChildByName("CoinEntity");
    game.data.coinsNotCollected = coins.length;

    // Remove the coins that we already collected
    for (var i = 0; i < game.data.collectedCoins.length; i++) {
      for (var x = 0; x < coins.length; x++) {
        var pos = game.data.collectedCoins[i];
        if (coins[x].pos.x === pos.x &&
            coins[x].pos.y === pos.y) {
          console.log("removing coin at " + pos.x + ", " + pos.y);
          me.game.world.removeChild(coins[x]);
          game.data.coinsNotCollected--;
        }
      }
    }
  },

  "shouldCollide" : function(a, b) {
    var answer = this.oldShouldCollide(a, b);
    if (answer === true) {
      // Do additional checks
      if (a.name === "mainplayer" && b.name == "me.levelentity") {
        if (game.data.coinsNotCollected > 0) {
          return false;
        }
      }
    }
    return answer;
  }
};
