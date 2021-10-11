
import Bullets from './Bullets';
import BurstStore from './BurstStore';
import { Unit } from './Units';
import Button from './Button';

const BulletsStore = {};

BulletsStore.Spooge = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Hydralisk',
    duration: 400,
    imgPos: {
      moving: {
        left: [14, 72, 136, 204],
        top: [758, 758, 758, 758],
      },
    },
    width: 56,
    height: 28,
    frame: {
      moving: 4,
    },
    burstEffect: BurstStore.HydraSpark,
  },
});
BulletsStore.Thorn = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Lurker',
    duration: 600,
    imgPos: {
      moving: {
        left: [61, 88, 117, 144, 117, 88],
        top: [711, 711, 711, 711, 711, 711],
      },
    },
    width: 28,
    height: 35,
    frame: {
      moving: 6,
    },
    forbidRotate: true,
  },
});
BulletsStore.Darts = Bullets.extends({
  constructorPlus: function (props) {
    this.life = this.traceTimes;
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst', //Source img inside Mutalisk.png
    duration: 400, //Match attack sound=1000?
    imgPos: {
      moving: {
        left: [0, 36, 72, 108, 144, 180, 216, 252, 288, 324],
        top: [1051, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1051, 1051],
      },
    },
    width: 36,
    height: 36,
    frame: {
      moving: 10,
    },
    burstEffect: BurstStore.GreenFog,
    //Chain tracing attack
    traceTimes: 3,
    traceRadius: 100,
    //Override
    noDamage: true,
    die: function () {
      var target = this.target;
      var owner = this.owner;
      //Interrupt tracing if target is dead first
      if (target.status == 'dead') {
        //Former behavior before override
        // this.inherited.die.call(this);
        const superClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        superClass.die.call(this);
      }
      //Override damage, damage reduce
      target.getDamageBy(owner, this.life / this.traceTimes);
      target.reactionWhenAttackedBy(owner);
      //Bullet reduce
      this.life--;
      var myself = this;
      var traceEnemies;
      //Get all possible enemies
      if (owner.isEnemy) {
        traceEnemies = owner.attackLimit
          ? owner.attackLimit == 'flying'
            ? Unit.ourFlyingUnits
            : Unit.ourGroundUnits
          : Unit.allOurUnits();
      } else {
        traceEnemies = owner.attackLimit
          ? owner.attackLimit == 'flying'
            ? Unit.enemyFlyingUnits
            : Unit.enemyGroundUnits
          : Unit.allEnemyUnits();
      }
      //Filter out trace-able enemies
      traceEnemies = traceEnemies.filter(function (chara) {
        return (
          chara != myself.target &&
          chara.insideCircle({
            centerX: myself.posX(),
            centerY: myself.posY(),
            radius: myself.traceRadius,
          })
        );
      });
      //Attack trace enemy
      if (traceEnemies.length > 0 && this.life > 0) {
        //Initial position again before jumping
        this.x = target.posX() - this.width / 2;
        this.y = target.posY() - this.height / 2;
        this.target = traceEnemies[0];
        var targetX = this.target.posX();
        var targetY = this.target.posY();
        var myX = this.posX();
        var myY = this.posY();
        //Update bullet speed
        this.speed = {
          x: (targetX - myX) / (this.duration / 100),
          y: (targetY - myY) / (this.duration / 100),
        };
        //Update bullet angle
        if (this.forbidRotate) this.angle = 0;
        else {
          //Below angle represents direction toward target
          this.angle = Math.atan((myY - targetY) / (targetX - myX));
          if (targetX < myX) this.angle += Math.PI;
        }
        //Fire bullet
        setTimeout(function () {
          myself.burst();
        }, this.duration);
      } else {
        //Former behavior before override
        // this.inherited.die.call(this);
        const superClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        superClass.die.call(this);
      }
    },
  },
});
BulletsStore.Parasite = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 600,
    imgPos: {
      moving: {
        left: 152,
        top: 0,
      },
    },
    width: 10,
    height: 34,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.Parasite,
  },
});
BulletsStore.GreenBall = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Guardian',
    duration: 800, //Match attack sound
    imgPos: {
      moving: {
        left: 32,
        top: 520,
      },
    },
    width: 20,
    height: 20,
    frame: {
      moving: 1,
    },
    forbidRotate: true,
    burstEffect: BurstStore.GreenBallBroken,
  },
});
BulletsStore.PurpleCloud = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Devourer',
    duration: 900, //Match attack sound
    imgPos: {
      moving: {
        left: 8,
        top: 973,
      },
    },
    width: 70,
    height: 32,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.PurpleCloudSpread,
  },
});
BulletsStore.Spore = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 500,
    imgPos: {
      moving: {
        left: 522,
        top: 6,
      },
    },
    width: 20,
    height: 20,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.Spore,
  },
});
BulletsStore.Flame = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 300,
    imgPos: {
      moving: {
        left: [15, 15, 80, 80, 170, 170],
        top: [86, 86, 86, 86, 86, 86],
      },
    },
    width: 76,
    height: 40,
    frame: {
      moving: 6,
    },
  },
});
BulletsStore.VultureBall = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 600,
    imgPos: {
      moving: {
        left: 152,
        top: 0,
      },
    },
    width: 10,
    height: 34,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.VultureSpark,
  },
});
BulletsStore.Missile = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Wraith',
    duration: 1000, //Match attack sound
    imgPos: {
      moving: {
        left: 8,
        top: 90,
      },
    },
    width: 16,
    height: 32,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.FireSparkSound,
  },
});
BulletsStore.LongMissile = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 600, //Match unit
    imgPos: {
      moving: {
        left: 0,
        top: 0,
      },
    },
    width: 35,
    height: 30,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.FireSparkSound,
  },
});
BulletsStore.SingleMissile = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 600, //Match unit
    imgPos: {
      moving: {
        left: 0,
        top: 0,
      },
    },
    width: 35,
    height: 15,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.FireSparkSound,
  },
});
// Bullets.MultipleMissileOld = Bullets.extends({
//   constructorPlus: function (props) {},
//   prototypePlus: {
//     //Add basic unit info
//     name: 'Burst',
//     duration: 600, //Match unit
//     imgPos: {
//       moving: {
//         left: 430, //230,430,454
//         top: 0,
//       },
//     },
//     width: 74, //48,74
//     height: 32,
//     frame: {
//       moving: 1,
//     },
//     burstEffect: Burst.SmallFireSpark,
//   },
// });
BulletsStore.MultipleMissile = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 600, //Match unit
    imgPos: {
      moving: {
        left: 304,
        top: 56,
      },
    },
    width: 94,
    height: 50,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.FireSparkSound,
  },
});
BulletsStore.Laser = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'BattleCruiser',
    duration: 300, //Match attack sound
    imgPos: {
      moving: {
        left: 16,
        top: 170,
      },
    },
    width: 68,
    height: 12,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.LaserSpark,
  },
});
BulletsStore.SmallLaser = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'BattleCruiser',
    duration: 300, //Match attack sound
    imgPos: {
      moving: {
        left: 20,
        top: 170,
      },
    },
    width: 22,
    height: 12,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.LaserSpark,
  },
});
BulletsStore.HeatLaser = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'HeroCruiser',
    duration: 300, //Match attack sound
    imgPos: {
      moving: {
        left: 16,
        top: 170,
      },
    },
    width: 68,
    height: 12,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.SmallExplode,
  },
});
BulletsStore.Yamato = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 500, //Match attack sound
    imgPos: {
      moving: {
        left: [288, 192, 96, 0],
        top: [1195, 1195, 1195, 1195],
      },
    },
    width: 96,
    height: 96,
    frame: {
      moving: 4,
    },
    burstEffect: BurstStore.MiddleExplode,
  },
});
BulletsStore.NuclearBomb = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 1000,
    imgPos: {
      moving: {
        left: 428,
        top: 66,
      },
    },
    width: 74,
    height: 32,
    frame: {
      moving: 1,
    },
  },
});
BulletsStore.DragoonBall = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 800, //Match attack sound
    imgPos: {
      moving: {
        left: [5, 36, 70, 101, 133],
        top: [862, 862, 862, 862, 862],
      },
    },
    width: 23,
    height: 21,
    frame: {
      moving: 5,
    },
    forbidRotate: true,
    burstEffect: BurstStore.DragoonBallBroken,
    //Delay fire for Dragoon and PhotonCannon
    fire: function () {
      var delay = this.owner.fireDelay;
      if (!delay) delay = 0;
      //Inherit fire function
      var myself = this;
      setTimeout(function () {
        Bullets.prototype.fire.call(myself);
      }, delay);
    },
  },
});
BulletsStore.ArchonLightening = Bullets.extends({
  constructorPlus: function (props) {
    //Override position to hands
    this.x += this.speed.x * 6; //N/8==40/70 (ArchonRadius/AttackRange)
    this.y += this.speed.y * 6;
    //Override speed, will not move
    this.speed = { x: 0, y: 0 };
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 800,
    imgPos: {
      moving: {
        left: [4, 192, 388, 580],
        top: [704, 704, 704, 704],
      },
    },
    width: 90,
    height: 75,
    frame: {
      moving: 4,
    },
  },
});
BulletsStore.ScoutMissile = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 1000,
    imgPos: {
      moving: {
        left: 53, //53//580
        top: 0,
      },
    },
    width: 30, //30//55
    height: 34, //34//45
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.DragoonBallBroken,
  },
});
BulletsStore.ReaverBomb = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 1000,
    imgPos: {
      moving: {
        left: 350, //186
        top: 0,
      },
    },
    width: 70, //62
    height: 34,
    frame: {
      moving: 1,
    },
    burstEffect: BurstStore.ReaverBurst,
    //Override
    fire: function () {
      Bullets.prototype.fire.call(this);
      //Consume scarab
      if (this.owner.scarabNum > 0) {
        this.owner.scarabNum--;
        Button.reset();
      }
    },
  },
});
BulletsStore.ReaverBombII = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 1000,
    imgPos: {
      moving: {
        left: 300,
        top: 0,
      },
    },
    width: 40,
    height: 30,
    frame: {
      moving: 1,
    },
    forbidRotate: true,
    burstEffect: BurstStore.ReaverBurst,
  },
});
BulletsStore.Interceptor = Bullets.extends({
  constructorPlus: function (props) {},
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    duration: 1000,
    imgPos: {
      moving: {
        left: [120, 170, 220, 272, 272, 120, 120, 120, 120, 120],
        top: [582, 582, 582, 582, 582, 582, 582, 582, 582, 582],
      },
    },
    width: 44,
    height: 28,
    frame: {
      moving: 10,
    },
    //Override cause damage timing
    noDamage: true,
    fire: function () {
      // this.inherited.fire.call(this);
      const superClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
      superClass.fire.call(this);
      var target = this.target;
      var owner = this.owner;
      setTimeout(function () {
        target.getDamageBy(owner);
        target.reactionWhenAttackedBy(owner);
      }, 500);
    },
  },
});
export default BulletsStore;
