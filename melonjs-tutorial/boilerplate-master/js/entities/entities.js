
game.PlayerEntity = me.Entity.extend({

  init: function(x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    
    this.body.setVelocity(3, 15);
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.alwaysUpdate = true;
  },

  update: function(dt) {
    if (this.alive === false) {
      return false;
    }

    if (me.input.isKeyPressed("left")) {
      // flip the sprite.
      this.flipX(true);
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
    } else if (me.input.isKeyPressed("right")) {
      this.flipX(false);
      this.body.vel.x += this.body.accel.x * me.timer.tick;
    } else {
      this.body.vel.x = 0;
    }

    var tried_to_jump = false;
    if (me.input.isKeyPressed("jump")) {
      if (!this.body.jumping && !this.body.falling) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        // me.audio.play("jump");
        tried_to_jump = true;
      }
    }

    // Did we fall off the screen?
    if (this.body.falling && 
        this.pos.y > (me.game.viewport.pos.y + me.game.viewport.height)) {
      // We need to die
      this.die();
    }

    this.body.update(dt);

    // check for collision with sthg
    me.collision.check(this, true, this.collideHandler.bind(this), true);

    if (this.body.vel.x != 0 || this.body.vel.y != 0) {
      if (tried_to_jump && this.body.vel.y != 0) {
        me.audio.play("jump");
      }
      this._super(me.Entity, "update", [dt]);
      return true;
    }

    // we didn't perform any animation.
    return false;
  },

  collideHandler: function(response, obj) {
    if (response.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      if ((response.overlapV.y>0) && !this.body.jumping) {
        // bounce (force jump)
        this.body.falling = false;
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        me.audio.play("stomp");
        response.b.die();
        game.data.score += 30;
      } else {
        // Let's flicker in case we touched an enemy
        // this.renderable.flicker(true);
        // Naw, let's just die.
        this.die();
      }
    } else if (response.b.body.collisionType == me.collision.types.ACTION_OBJECT) {
      game.data.current_level = response.b.nextlevel;
    }
  },

  die: function() {
    if (this.alive) {
      game.data.lives--;
      this.alive = false;
    }
    me.game.viewport.fadeIn("#dddddd", 1700, function() {
      if (game.data.lives == 0) {
        me.state.change(me.state.MENU);
      } else {
        me.state.change(me.state.PLAY);
      }
    });
  }
});


game.CoinEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this._super(me.CollectableEntity, "init", [x, y, settings]);

    this.body.onCollision = this.onCollision.bind(this);
  },

  onCollision: function() {
    game.data.score += 3;
    game.data.coinsNotCollected--;

    me.audio.play("cling");

    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
  }
});


game.EnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    // We could do this in Tiled or here.
    settings.image = "wheelie_right";
    var width = settings.width;
    var height = settings.height;
    
    settings.spritewidth = settings.width = 64;
    settings.spriteheight = settings.height = 64;

    this._super(me.Entity, "init", [x, y, settings]);
    
    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - settings.spritewidth;
    this.pos.x = x + width -  settings.spritewidth;

    this.updateBounds();
    this.walkLeft = false;
    this.body.setVelocity(3.3, 6);
  },

  die: function() {
    this.alive = false;
    me.game.world.removeChild(this);
  },
    
  onCollision: function(res, obj) {
    // res.y > 0 means touched by something on the bottom
    // which means at top bosition for this one
    if (this.alive && (res.y > 0) && obj.falling) {
      this.renderable.flicker(750);
    }
  },

  update: function(dt) {
    if (this.alive) {
      if (this.walkLeft && this.pos.x < this.startX) {
        this.walkLeft = false;
        this.flipX(this.walkLeft);
      } else if (!this.walkLeft && this.pos.x > this.endX) {
        this.walkLeft = true;
        this.flipX(this.walkLeft);
      } 

      this.body.vel.x += this.walkLeft 
        ? -this.body.accel.x*me.timer.tick
        : this.body.accel.x*me.timer.tick;

    } else {
      this.body.vel.x = 0;
    }

    this.body.update(dt);
    
    if (this.body.vel.x != 0 || this.body.vel.y != 0) {
      this._super(me.Entity, "update", [dt]);
      return true;
    }

    return false;
  }
});
