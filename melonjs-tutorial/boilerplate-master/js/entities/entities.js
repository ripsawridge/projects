
game.PlayerEntity = me.Entity.extend({

  init: function(x, y, settings) {
    this._super(me.Entity, "init", [x, y, settings]);
    
    this.body.setVelocity(3, 15);
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.alwaysUpdate = true;
  },

  update: function(dt) {
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

    if (me.input.isKeyPressed("jump")) {
      if (!this.body.jumping && !this.body.falling) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        me.audio.play("jump");
      }
    }

    this.body.update(dt);

    // check for collision with sthg
    me.collision.check(this, true, this.collideHandler.bind(this), true);

    if (this.body.vel.x != 0 || this.body.vel.y != 0) {
      this._super(me.Entity, "update", [dt]);
      return true;
    }

    // we didn't perform any animation.
    return false;
  },

  collideHandler: function(response) {
    if (response.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
      if ((response.overlapV.y>0) && !this.body.jumping) {
        // bounce (force jump)
        this.body.falling = false;
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
        me.audio.play("stomp");
      } else {
        // Let's flicker in case we touched an enemy
        this.renderable.flicker(true);
      }
    }
  }
});


game.CoinEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this._super(me.CollectableEntity, "init", [x, y, settings]);

    this.body.onCollision = this.onCollision.bind(this);
  },

  onCollision: function() {
    game.data.score += 3;

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
