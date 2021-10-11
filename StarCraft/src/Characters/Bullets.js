import GlobalObject from './GlobalObject';
import Building from './Building';
import { Unit } from './Units';

var Bullets = GlobalObject.extends({
  constructorPlus: function (props) {
    this.owner = props.from;
    //Makes below initial keep the same
    var ownerX = this.owner instanceof GlobalObject ? this.owner.posX() : this.owner.x;
    var ownerY = this.owner instanceof GlobalObject ? this.owner.posY() : this.owner.y;
    this.target = props.to;
    //Makes below initial keep the same
    var targetX =
      this.target instanceof GlobalObject ? this.target.posX() : this.target.x;
    var targetY =
      this.target instanceof GlobalObject ? this.target.posY() : this.target.y;
    //Convert from center point to left-top
    this.x = ownerX - this.width / 2;
    this.y = ownerY - this.height / 2;
    //Use centerP to centerP is correct, bullet has inconsistent speed
    this.speed = {
      x: (targetX - ownerX) / (this.duration / 100),
      y: (targetY - ownerY) / (this.duration / 100),
    };
    if (this.forbidRotate) this.angle = 0;
    else {
      //Below angle represents direction toward target
      this.angle = Math.atan((ownerY - targetY) / (targetX - ownerX));
      if (targetX < ownerX) this.angle += Math.PI;
    }
    //By default it's not shown
    this.status = 'dead';
    //Fixed damage if be set
    if (props.damage != null) this.damage = props.damage;
  },
  prototypePlus: {
    duration: 500, //Will move for 500ms as default
    //Override to use 8 directions speed
    updateLocation: function () {
      //No direction speed
      this.x += this.speed.x;
      this.y += this.speed.y;
    },
    burst: function () {
      var owner = this.owner;
      var target = this.target;
      //Bullet over, now burst turn to show
      this.die();
      //Filter out magic bullet with fixed destination
      if (!(target instanceof GlobalObject)) return;
      //Init targets if AOE
      var targets;
      if (owner.AOE) {
        //Get possible targets
        if (owner.isEnemy) {
          targets = owner.attackLimit
            ? owner.attackLimit == 'flying'
              ? Unit.ourFlyingUnits
              : Unit.ourGroundUnits.concat(Building.ourBuildings)
            : Unit.allOurUnits().concat(Building.ourBuildings);
        } else {
          targets = owner.attackLimit
            ? owner.attackLimit == 'flying'
              ? Unit.enemyFlyingUnits
              : Unit.enemyGroundUnits.concat(Building.enemyBuildings)
            : Unit.allEnemyUnits().concat(Building.enemyBuildings);
        }
        //Range filter
        switch (owner.AOE.type) {
          case 'LINE':
            //Calculate inter-points between enemy
            var N = Math.ceil(owner.distanceFrom(target) / owner.AOE.radius);
            targets = targets.filter(function (chara) {
              for (var n = 1; n <= N; n++) {
                var X = owner.posX() + (n * (target.posX() - owner.posX())) / N;
                var Y = owner.posY() + (n * (target.posY() - owner.posY())) / N;
                if (
                  chara.insideCircle({
                    centerX: X >> 0,
                    centerY: Y >> 0,
                    radius: owner.AOE.radius,
                  }) &&
                  !chara.isInvisible
                ) {
                  return true;
                }
              }
              return false;
            });
            break;
          //Default type is CIRCLE
          case 'CIRCLE':
          default:
            targets = targets.filter(function (chara) {
              return (
                chara.insideCircle({
                  centerX: target.posX(),
                  centerY: target.posY(),
                  radius: owner.AOE.radius,
                }) && !chara.isInvisible
              );
            });
        }
      }
      if (this.burstEffect) {
        //Show burst effect on target
        if (owner.AOE && owner.AOE.hasEffect) {
          var burstEffect = this.burstEffect;
          targets.forEach(function (chara) {
            new burstEffect({ target: chara, above: true });
          });
        } else {
          new this.burstEffect({ target: target, above: true });
        }
      }
      //Real bullet
      if (!this.noDamage) {
        //Cause damage when burst appear
        if (owner.AOE) {
          var myself = this;
          targets.forEach(function (chara) {
            if (myself.damage != null) target.getDamageBy(myself.damage);
            else target.getDamageBy(owner);
            chara.reactionWhenAttackedBy(owner);
          });
        } else {
          if (this.damage != null) target.getDamageBy(this.damage);
          else target.getDamageBy(owner);
          target.reactionWhenAttackedBy(owner);
        }
      }
    },
    //Upgrade GlobalObject moving, replace run as fire
    fire: function (callback) {
      this.moving();
      //Sound effect
      if (this.insideScreen() && this.owner.sound.attack)
        this.owner.sound.attack.play();
      //Will burst and stop moving after time limit arrive
      var myself = this;
      setTimeout(function () {
        myself.burst();
        //Something happens after bullet burst
        if (callback) callback();
      }, this.duration);
    },
  },
});

export default Bullets;
