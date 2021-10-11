import Burst from './Burst';
import GlobalObject from './GlobalObject';
import Game from '../GameRule/Game';

GlobalObject.prototype.evolveTo = function (charaType, burstArr) {
  var newTypeChara = null;
  var selectedStatus = [this.selected, this == Game.selectedUnit];
  //Hide die burst and sound for old unit, then die
  this.dieEffect = this.sound.death = null;
  this.die();
  if (this.processing) delete this.processing;
  //Birth function
  var bornAt = function (chara) {
    newTypeChara = new charaType({ target: chara });
    //Fix cannot select egg issue
    setTimeout(function () {
      if (selectedStatus[0]) Game.addIntoAllSelected(newTypeChara);
      if (selectedStatus[1]) Game.changeSelectedTo(newTypeChara);
    }, 0);
  };
  //Burst chain
  if (burstArr) {
    var pos = { x: this.posX(), y: this.posY() };
    var birth = new BurstStore[burstArr[0]](pos);
    var evolveChain = function (N) {
      return function () {
        birth = new BurstStore[burstArr[N]](pos);
        if (N + 1 < burstArr.length) birth.callback = evolveChain(N + 1);
        //Finish evolve chain
        else
          birth.callback = function () {
            var times = charaType.prototype.birthCount;
            if (times == null) times = 1;
            for (var N = 0; N < times; N++) {
              bornAt(birth);
            }
          };
      };
    };
    //Start evolve chain
    if (burstArr.length > 1) birth.callback = evolveChain(1);
    //Finish evolve chain
    else
      birth.callback = function () {
        var times = charaType.prototype.birthCount;
        if (times == null) times = 1;
        for (var N = 0; N < times; N++) {
          bornAt(birth);
        }
      };
  } else bornAt(this);
  return newTypeChara;
};

const BurstStore = {};

//Define different bursts
BurstStore.GreenFog = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    new Audio('bgm/GreenFog.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Mutalisk', //Source img inside Mutalisk.png
    imgPos: {
      burst: {
        left: [8, 68, 134, 198, 263, 8, 68, 134, 198, 263],
        top: [468, 468, 468, 468, 468, 532, 532, 532, 532, 532],
      },
    },
    width: 52,
    height: 57,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.Parasite = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    new Audio('bgm/Magic.Parasite.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Mutalisk',
    imgPos: {
      burst: {
        left: [8, 68, 134, 198, 263, 8, 68, 134, 198, 263],
        top: [468, 468, 468, 468, 468, 532, 532, 532, 532, 532],
      },
    },
    width: 52,
    height: 57,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.Spore = Burst.extends({
  constructorPlus: function (props) {
    //No sound
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Mutalisk',
    imgPos: {
      burst: {
        left: [8, 68, 134, 198, 263, 8, 68, 134, 198, 263],
        top: [468, 468, 468, 468, 468, 532, 532, 532, 532, 532],
      },
    },
    width: 52,
    height: 57,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.GreenBallBroken = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/Greenball.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Guardian',
    imgPos: {
      burst: {
        left: [0, 56, 119, 182, 252, 322, 396, 470],
        top: [556, 556, 556, 556, 556, 556, 556, 556],
      },
    },
    width: 60,
    height: 60,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.PurpleCloudSpread = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/PurpleCloud.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Devourer',
    imgPos: {
      burst: {
        left: [17, 70, 122, 174, 230, 280, 335, 390, 452],
        top: [1022, 1022, 1022, 1022, 1022, 1022, 1022, 1022, 1022],
      },
    },
    width: 50,
    height: 60,
    callback: function () {
      var chara = this.target;
      //Fix all spored issue
      if (chara.status == 'dead' || chara.status == null) return;
      //Effect:PurpleBuffer when cloud spread on target chara
      //Buffer flag, can add up
      if (chara.buffer.PurpleCloud == 9) return; //9 at max
      if (chara.buffer.PurpleCloud > 0) chara.buffer.PurpleCloud++;
      else chara.buffer.PurpleCloud = 1;
      //Decrease defense and slow down attack rate
      var bufferObj = {
        armor: chara.get('armor') - 1,
      };
      if (chara.plasma != null) bufferObj.plasma = chara.get('plasma') - 1;
      if (chara.attackInterval)
        bufferObj.attackInterval = Math.round(
          chara.get('attackInterval') * 1.1
        );
      //Apply buffer
      chara.addBuffer(bufferObj);
      if (!chara.purpleBuffer) chara.purpleBuffer = [];
      chara.purpleBuffer.push(bufferObj);
      //Purple effect
      new BurstStore.PurpleEffect({
        target: chara,
        callback: function () {
          //Restore in 30 seconds, Last In First Out
          if (
            chara.purpleBuffer &&
            chara.removeBuffer(chara.purpleBuffer.pop())
          ) {
            chara.buffer.PurpleCloud--;
          }
          //Full restore
          if (chara.buffer.PurpleCloud == 0) {
            delete chara.buffer.PurpleCloud;
            delete chara.purpleBuffer;
          }
        },
      });
    },
    frame: {
      burst: 9,
    },
  },
});
BurstStore.Sunken = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/Sunken.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [46, 174, 302, 432, 560, 688],
        top: [626, 626, 626, 626, 626, 626],
      },
    },
    width: 28,
    height: 40,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.SmallFireSpark = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/FireSpark.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Wraith',
    imgPos: {
      burst: {
        left: [64, 106, 64],
        top: [91, 91, 91],
      },
    },
    width: 32,
    height: 28,
    frame: {
      burst: 3,
    },
  },
});
BurstStore.FireSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Ghost',
    imgPos: {
      burst: {
        left: [0, 38, 76, 114, 152, 190, 228, 266, 304, 342],
        top: [596, 596, 596, 596, 596, 596, 596, 596, 596, 596],
      },
    },
    width: 38,
    height: 36,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.FireSparkSound = BurstStore.FireSpark.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/FireSpark.burst.wav').play();
  },
  prototypePlus: {
    //Nothing
  },
});
BurstStore.LaserSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [18, 70, 128, 182],
        top: [50, 50, 50, 50],
      },
    },
    width: 30,
    height: 30,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.VultureSpark = BurstStore.LaserSpark.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/VultureSpark.burst.wav').play();
  },
  prototypePlus: {
    //Nothing
  },
});
BurstStore.HydraSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Hydralisk',
    imgPos: {
      burst: {
        left: [0, 34, 68, 102, 136, 170, 204, 238],
        top: [801, 801, 801, 801, 801, 801, 801, 801],
      },
    },
    width: 34,
    height: 35,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.CorsairCloud = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [5, 57], //[1, 64, 128]
        top: [576, 576],
      },
    },
    width: 40, //62
    height: 44, //44
    frame: {
      burst: 2,
    },
  },
});
BurstStore.ArchonBurst = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 80, 160, 240, 320, 400],
        top: [779, 779, 779, 779, 779, 779],
      },
    },
    width: 80,
    height: 80,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.DragoonBallBroken = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/DragoonBall.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [
          0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520,
        ],
        top: [
          891, 891, 891, 891, 891, 891, 891, 891, 891, 891, 891, 891, 891, 891,
        ],
      },
    },
    width: 38,
    height: 40,
    frame: {
      burst: 14,
    },
  },
});
BurstStore.ShootSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360],
        top: [1011, 1011, 1011, 1011, 1011, 1011, 1011, 1011, 1011, 1011],
      },
    },
    width: 40,
    height: 40,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.BlueShootSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [32, 64, 96, 128, 160, 192, 224, 256],
        top: [1115, 1115, 1115, 1115, 1115, 1115, 1115, 1115],
      },
    },
    width: 32,
    height: 32,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.SCVSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 48, 96, 144, 192, 240, 288, 336, 384, 432],
        top: [1147, 1147, 1147, 1147, 1147, 1147, 1147, 1147, 1147, 1147],
      },
    },
    width: 48,
    height: 48,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.ProbeSpark = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 48, 96, 144, 192, 240, 288],
        top: [672, 672, 672, 672, 672, 672, 672],
      },
    },
    width: 48,
    height: 32,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.ReaverBurst = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/ReaverBomb.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 80, 160, 240, 320, 400, 480, 560, 640, 720],
        top: [931, 931, 931, 931, 931, 931, 931, 931, 931, 931],
      },
    },
    width: 78,
    height: 64,
    frame: {
      burst: 10,
    },
  },
});

BurstStore.InfestedBomb = Burst.extends({
  constructorPlus: function (props) {
    //Has burst sound effect
    if (this.insideScreen()) new Audio('bgm/ReaverBomb.burst.wav').play();
  },
  prototypePlus: {
    //Add basic unit info
    name: 'InfestedTerran',
    imgPos: {
      burst: {
        left: [0, 78, 156, 234, 312, 0, 78, 156, 234, 312],
        top: [432, 432, 432, 432, 432, 496, 496, 496, 496, 496],
      },
    },
    width: 78,
    height: 64,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.ScourgeBomb = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Scourge',
    imgPos: {
      burst: {
        left: [0, 52, 104, 156, 208, 260, 312, 364, 416],
        top: [218, 218, 218, 218, 218, 218, 218, 218, 218],
      },
    },
    width: 52,
    height: 46,
    frame: {
      burst: 9,
    },
  },
});

BurstStore.SmallExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [56, 156, 256, 360],
        top: [1686, 1686, 1686, 1686],
      },
    },
    width: 80,
    height: 60,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.MiddleExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [44, 192, 342, 498],
        top: [1754, 1754, 1754, 1754],
      },
    },
    width: 120,
    height: 90,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.BigExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [26, 226, 424, 632],
        top: [1846, 1846, 1846, 1846],
      },
    },
    width: 160,
    height: 120,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.SmallBlueExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [50, 150, 250, 356],
        top: [1424, 1424, 1424, 1424],
      },
    },
    width: 80,
    height: 60,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.MiddleBlueExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [36, 184, 338, 494],
        top: [1484, 1484, 1484, 1484],
      },
    },
    width: 120,
    height: 90,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.BigBlueExplode = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [22, 222, 420, 632],
        top: [1566, 1566, 1566, 1566],
      },
    },
    width: 160,
    height: 120,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.ZergBuildingBurst = Burst.extends({
  constructorPlus: function (props) {
    //Need clear mud when ZergBuildingBurst finished
    this.callback = function () {
      Map.needRefresh = 'MAP';
    };
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [
          0, 200, 400, 600, 800, 0, 200, 400, 600, 800, 0, 200, 400, 400, 600,
          600, 800, 800,
        ],
        top: [
          0, 0, 0, 0, 0, 200, 200, 200, 200, 200, 400, 400, 400, 400, 400, 400,
          400, 400,
        ],
      },
    },
    width: 200,
    height: 200,
    frame: {
      burst: 18,
    },
  },
});
BurstStore.TerranBuildingBurst = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [
          0, 0, 200, 200, 400, 400, 600, 600, 800, 800, 0, 0, 200, 200, 400,
          400, 600, 600,
        ],
        top: [
          600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 800, 800, 800, 800,
          800, 800, 800, 800,
        ],
      },
    },
    width: 200,
    height: 200,
    frame: {
      burst: 18,
    },
  },
});
BurstStore.ProtossBuildingBurst = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'BuildingBurst',
    imgPos: {
      burst: {
        left: [
          0, 0, 200, 200, 400, 400, 600, 600, 800, 800, 0, 0, 200, 200, 400,
          400, 600, 600,
        ],
        top: [
          1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1200,
          1200, 1200, 1200, 1200, 1200, 1200, 1200,
        ],
      },
    },
    width: 200,
    height: 200,
    frame: {
      burst: 18,
    },
  },
});
BurstStore.HumanDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Civilian',
    imgPos: {
      burst: {
        left: [6, 58, 106, 158, 6, 54, 102, 152],
        top: [286, 286, 286, 286, 320, 320, 320, 320],
      },
    },
    width: 42,
    height: 30,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.MedicDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Medic',
    imgPos: {
      burst: {
        left: [0, 64, 128, 192, 256, 320, 384, 448],
        top: [832, 832, 832, 832, 832, 832, 832, 832],
      },
    },
    width: 64,
    height: 64,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.SmallZergFlyingDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Mutalisk',
    imgPos: {
      burst: {
        left: [71, 143, 215, 283, 355, 432, 502],
        top: [372, 372, 372, 372, 372, 372, 372],
      },
    },
    width: 64,
    height: 62,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.BigZergFlyingDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Devourer',
    imgPos: {
      burst: {
        left: [0, 114, 228, 342, 456, 570, 684, 798],
        top: [860, 860, 860, 860, 860, 860, 860, 860],
      },
    },
    width: 114,
    height: 102,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.DroneDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Drone',
    imgPos: {
      burst: {
        left: [0, 128, 256, 384, 512, 640, 768, 896],
        top: [1280, 1280, 1280, 1280, 1280, 1280, 1280, 1280],
      },
    },
    width: 128,
    height: 128,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.ZerglingDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Zergling',
    imgPos: {
      burst: {
        left: [0, 68, 136, 204, 272, 340, 408],
        top: [506, 506, 506, 506, 506, 506, 506],
      },
    },
    width: 68,
    height: 55,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.HydraliskDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Hydralisk',
    imgPos: {
      burst: {
        left: [0, 66, 132, 198, 264, 330, 396, 462, 528, 594, 660, 726],
        top: [704, 704, 704, 704, 704, 704, 704, 704, 704, 704, 704, 704],
      },
    },
    width: 66,
    height: 50,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.LurkerDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Lurker',
    imgPos: {
      burst: {
        left: [85, 170, 255, 340, 0, 85, 170, 255, 340],
        top: [582, 582, 582, 582, 646, 646, 646, 646, 646],
      },
    },
    width: 85,
    height: 64,
    frame: {
      burst: 9,
    },
  },
});
BurstStore.UltraliskDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Ultralisk',
    imgPos: {
      burst: {
        left: [0, 101, 202, 303, 404, 505, 606, 707, 808, 909],
        top: [1620, 1620, 1620, 1620, 1620, 1620, 1620, 1620, 1620, 1620],
      },
    },
    width: 101,
    height: 108,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.DefilerDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Defiler',
    imgPos: {
      burst: {
        left: [0, 70, 140, 210, 280, 350, 420, 490, 560, 630],
        top: [558, 558, 558, 558, 558, 558, 558, 558, 558, 558],
      },
    },
    width: 70,
    height: 46,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.BroodlingDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Queen',
    imgPos: {
      burst: {
        left: [0, 40, 80, 120, 160],
        top: [782, 782, 782, 782, 782],
      },
    },
    width: 40,
    height: 22,
    frame: {
      burst: 5,
    },
  },
});
BurstStore.LarvaDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 50, 100, 150, 200, 250, 300, 350, 400],
        top: [146, 146, 146, 146, 146, 146, 146, 146, 146],
      },
    },
    width: 50,
    height: 26,
    frame: {
      burst: 9,
    },
  },
});
BurstStore.EggDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 70, 140, 210, 280, 350, 0, 70, 140, 210, 280, 350],
        top: [254, 254, 254, 254, 254, 254, 312, 312, 312, 312, 312, 312],
      },
    },
    width: 70,
    height: 59,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.EggBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [2, 38, 74, 110, 146, 182, 218, 254],
        top: [372, 372, 372, 372, 372, 372, 372, 372],
      },
    },
    width: 36,
    height: 40,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.DroneBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [1, 68, 135, 202, 269, 336, 403],
        top: [442, 442, 442, 442, 442, 442, 442],
      },
    },
    width: 67,
    height: 44,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.OverlordBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 63, 126, 189, 252, 315, 378],
        top: [486, 486, 486, 486, 486, 486, 486],
      },
    },
    width: 63,
    height: 95,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.ZerglingBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 59, 118, 177, 236, 295, 354],
        top: [582, 582, 582, 582, 582, 582, 582],
      },
    },
    width: 59,
    height: 45,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.HydraliskBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 63, 126, 189, 252, 315, 378],
        top: [666, 666, 666, 666, 666, 666, 666],
      },
    },
    width: 63,
    height: 45,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.MutaliskBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 66, 132, 198, 264, 330, 396],
        top: [712, 712, 712, 712, 712, 712, 712],
      },
    },
    width: 66,
    height: 88,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.ScourgeBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 62, 124, 186, 248, 310, 372],
        top: [798, 798, 798, 798, 798, 798, 798],
      },
    },
    width: 62,
    height: 70,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.QueenBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 62, 124, 186, 248, 310, 372],
        top: [867, 867, 867, 867, 867, 867, 867],
      },
    },
    width: 62,
    height: 84,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.UltraliskBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 72, 144, 216, 288, 360, 432],
        top: [950, 950, 950, 950, 950, 950, 950],
      },
    },
    width: 72,
    height: 60,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.DefilerBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Larva',
    imgPos: {
      burst: {
        left: [0, 64, 128, 192, 256, 320, 384],
        top: [1011, 1011, 1011, 1011, 1011, 1011, 1011],
      },
    },
    width: 64,
    height: 48,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.LurkerBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Lurker',
    imgPos: {
      burst: {
        left: [650, 722, 794, 866, 938, 1010, 1082],
        top: [480, 480, 480, 480, 480, 480, 480],
      },
    },
    width: 72,
    height: 67,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.GuardianBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Guardian',
    imgPos: {
      burst: {
        left: [656, 737, 818, 899, 980, 1061],
        top: [538, 538, 538, 538, 538, 538],
      },
    },
    width: 81,
    height: 74,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.DevourerBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Devourer',
    imgPos: {
      burst: {
        left: [666, 764, 862, 960, 1058, 1156],
        top: [998, 998, 998, 998, 998, 998],
      },
    },
    width: 73,
    height: 86,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.SmallProtossDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Zealot',
    imgPos: {
      burst: {
        left: [0, 57, 114, 171, 228, 285, 342],
        top: [575, 575, 575, 575, 575, 575, 575],
      },
    },
    width: 57,
    height: 84,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.DragoonDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Dragoon',
    imgPos: {
      burst: {
        left: [15, 111, 207, 303, 399, 495, 591],
        top: [591, 591, 591, 591, 591, 591, 591],
      },
    },
    width: 57,
    height: 84,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.TemplarDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Templar',
    imgPos: {
      burst: {
        left: [30, 158, 286, 414, 542, 670],
        top: [2078, 2078, 2078, 2078, 2078, 2078],
      },
    },
    width: 57,
    height: 84,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.HallucinationDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [514, 593, 672, 514, 593, 672, 514, 593, 672, 514, 593, 672],
        top: [460, 460, 460, 526, 526, 526, 592, 592, 592, 658, 658, 658],
      },
    },
    width: 79,
    height: 66,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.ArchonBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Archon',
    imgPos: {
      burst: {
        left: [20, 140, 260, 380, 500, 620, 740, 860, 980],
        top: [1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700],
      },
    },
    width: 80,
    height: 80,
    frame: {
      burst: 9,
    },
  },
});
BurstStore.DarkArchonBirth = Burst.extends({
  constructorPlus: function (props) {
    //Mixin
  },
  prototypePlus: {
    //Add basic unit info
    name: 'DarkArchon',
    imgPos: {
      burst: {
        left: [20, 140, 260, 380, 500, 620, 740, 860, 980],
        top: [1220, 1220, 1220, 1220, 1220, 1220, 1220, 1220, 1220],
      },
    },
    width: 80,
    height: 80,
    frame: {
      burst: 9,
    },
  },
});

BurstStore.RagnasaurDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Ragnasaur',
    imgPos: {
      burst: {
        left: [0, 104, 208, 312, 416, 520, 624, 728],
        top: [936, 936, 936, 936, 936, 936, 936, 936],
      },
    },
    width: 128,
    height: 128,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.RhynsdonDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Rhynsdon',
    imgPos: {
      burst: {
        left: [0, 104, 208, 312, 416, 520, 624, 728],
        top: [1144, 1144, 1144, 1144, 1144, 1144, 1144, 1144],
      },
    },
    width: 104,
    height: 128,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.UrsadonDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Ursadon',
    imgPos: {
      burst: {
        left: [0, 92, 184, 276, 368, 460, 552, 644],
        top: [736, 736, 736, 736, 736, 736, 736, 736],
      },
    },
    width: 92,
    height: 92,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.BengalaasDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Bengalaas',
    imgPos: {
      burst: {
        left: [0, 128, 256, 384, 512, 640, 768, 896],
        top: [1536, 1536, 1536, 1536, 1536, 1536, 1536, 1536],
      },
    },
    width: 128,
    height: 128,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.ScantidDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Scantid',
    imgPos: {
      burst: {
        left: [0, 92, 184, 276, 368, 460, 552, 644],
        top: [1104, 1104, 1104, 1104, 1104, 1104, 1104, 1104],
      },
    },
    width: 92,
    height: 92,
    frame: {
      burst: 8,
    },
  },
});
BurstStore.KakaruDeath = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Kakaru',
    imgPos: {
      burst: {
        left: [0, 92, 184, 276, 368, 460, 552, 644],
        top: [1104, 1104, 1104, 1104, 1104, 1104, 1104, 1104],
      },
    },
    width: 92,
    height: 92,
    frame: {
      burst: 8,
    },
  },
});

// =================== Animation =================

BurstStore.getAllAnimations = function () {
  var allAnimes = [];
  for (var attr in BurstStore) {
    if (Object.getPrototypeOf(BurstStore[attr]) === Burst) {
      allAnimes.push(BurstStore[attr]);
    }
  }
  return allAnimes;
};

BurstStore.getName = function (anime) {
  for (var attr in BurstStore) {
    //Should be animation constructor firstly
    if (
      Object.getPrototypeOf(BurstStore[attr]) === Burst &&
      anime instanceof BurstStore[attr]
    )
      return attr;
  }
};

//BurstStore Burst

BurstStore.RightClickCursor = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Burst',
    imgPos: {
      burst: {
        left: [0, 44, 88, 132],
        top: [1087, 1087, 1087, 1087],
      },
    },
    width: 44,
    height: 28,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.PsionicStorm = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 188, 376, 564, 0, 188, 376, 564, 0, 188, 376, 564, 0, 188],
        top: [0, 0, 0, 0, 153, 153, 153, 153, 306, 306, 306, 306, 459, 459],
      },
    },
    width: 188,
    height: 153,
    scale: 1.2,
    duration: 7000,
    frame: {
      burst: 14,
    },
  },
});
BurstStore.Hallucination = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          752, 815, 878, 941, 1004, 1067, 1130, 1193, 1256, 752, 815, 878, 941,
          1004, 1067, 1130, 1193, 1256,
        ],
        top: [0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 63, 63, 63, 63, 63, 63, 63, 63],
      },
    },
    width: 63,
    height: 63,
    above: true,
    frame: {
      burst: 18,
    },
  },
});
BurstStore.Consume = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          752, 826, 900, 974, 1048, 1122, 1196, 1270, 1344, 752, 826, 900, 974,
          1048, 1122, 1196, 1270, 1344,
        ],
        top: [
          126, 126, 126, 126, 126, 126, 126, 126, 126, 196, 196, 196, 196, 196,
          196, 196, 196, 196,
        ],
      },
    },
    width: 74,
    height: 70,
    above: true,
    autoSize: true,
    frame: {
      burst: 18,
    },
  },
});
BurstStore.StasisField = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: 376,
        top: 459,
      },
    },
    width: 130,
    height: 110,
    above: true,
    autoSize: 'MAX',
    scale: 1.25,
    duration: 30000,
    frame: {
      burst: 1,
    },
  },
});
BurstStore.Lockdown = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [330, 0, 110, 220, 330, 0, 0, 0, 110, 220, 330, 0, 110, 220],
        top: [
          723, 834, 834, 834, 834, 945, 0, 612, 612, 612, 612, 723, 723, 723,
        ],
      },
    },
    width: 110,
    height: 111,
    above: true,
    autoSize: 'MAX',
    duration: 60000,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.DarkSwarm = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1260, 752, 1006, 1260, 752, 0, 752, 1006, 1260, 752, 1006],
        top: [456, 645, 645, 645, 834, 0, 267, 267, 267, 456, 456],
      },
    },
    width: 254,
    height: 189,
    scale: 1.2,
    duration: 60000,
    frame: {
      burst: 5,
    },
  },
});
BurstStore.Plague = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          1144, 1274, 1404, 754, 884, 1014, 1144, 1274, 1404, 754, 884, 1014,
          1144, 1274,
        ],
        top: [
          892, 892, 892, 1022, 1022, 1022, 1022, 1022, 1022, 1152, 1152, 1152,
          1152, 1152,
        ],
      },
    },
    width: 130,
    height: 130,
    scale: 1.2,
    frame: {
      burst: 14,
    },
  },
});
BurstStore.PurpleEffect = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [440, 499, 558, 617],
        top: [902, 902, 902, 902],
      },
    },
    width: 59,
    height: 60,
    above: true,
    autoSize: 'MIN',
    duration: 30000,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.RedEffect = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1006, 1068, 1130, 1192],
        top: [836, 836, 836, 836],
      },
    },
    width: 62,
    height: 50,
    above: true,
    autoSize: 'MIN',
    duration: 30000,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.GreenEffect = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1256, 1313, 1370, 1427],
        top: [836, 836, 836, 836],
      },
    },
    width: 57,
    height: 46,
    above: true,
    autoSize: 'MIN',
    duration: 30000,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.GlobalObject = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          0, 131, 262, 393, 524, 0, 131, 262, 393, 524, 0, 131, 262, 393, 524,
        ],
        top: [
          1056, 1056, 1056, 1056, 1056, 1181, 1181, 1181, 1181, 1181, 1306,
          1306, 1306, 1306, 1306,
        ],
      },
    },
    width: 131,
    height: 125,
    scale: 1.2,
    frame: {
      burst: 15,
    },
  },
});
BurstStore.ScannerSweep = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          1012, 1012, 1167, 1167, 1322, 1322, 1012, 1012, 1167, 1167, 1322,
          1322,
        ],
        top: [
          2220, 2220, 2220, 2220, 2220, 2220, 2335, 2335, 2335, 2335, 2335,
          2335,
        ],
      },
    },
    width: 155,
    height: 115,
    scale: 1.5,
    duration: 15600,
    sight: 350,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.Feedback = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          632, 702, 772, 842, 912, 982, 1052, 1122, 1192, 1262, 1332, 1402,
        ],
        top: [
          2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872, 2872,
          2872,
        ],
      },
    },
    width: 70,
    height: 70,
    above: true,
    autoSize: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.HellFire = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [655, 730, 805, 880, 955, 1030, 1105, 1180, 1255, 1330],
        top: [1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284, 1284],
      },
    },
    width: 75,
    height: 75,
    above: true,
    autoSize: true,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.MindControl = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          658, 720, 782, 844, 906, 968, 1030, 1092, 1154, 1216, 1278, 1340,
        ],
        top: [
          1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378, 1378,
          1378,
        ],
      },
    },
    width: 62,
    height: 40,
    above: true,
    autoSize: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.RechargeShields = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          0, 64, 128, 192, 256, 320, 384, 448, 0, 64, 128, 192, 256, 320, 384,
          448,
        ],
        top: [
          1432, 1432, 1432, 1432, 1432, 1432, 1432, 1432, 1496, 1496, 1496,
          1496, 1496, 1496, 1496, 1496,
        ],
      },
    },
    width: 64,
    height: 64,
    above: true,
    autoSize: true,
    frame: {
      burst: 16,
    },
  },
});
BurstStore.DisruptionWeb = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          1396, 1396, 1396, 1396, 1088, 1088, 1242, 1242, 1392, 1392, 1392,
          1392,
        ],
        top: [
          1194, 1194, 1322, 1322, 1432, 1432, 1432, 1432, 1432, 1432, 1538,
          1538,
        ],
      },
    },
    width: 154,
    height: 112,
    scale: 1.2,
    duration: 25000,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.DefensiveMatrix = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1327, 1427, 1327, 1427, 1327],
        top: [1664, 1664, 1751, 1751, 1838],
      },
    },
    width: 90,
    height: 84,
    above: true,
    autoSize: true,
    duration: 60000,
    frame: {
      burst: 5,
    },
  },
});
BurstStore.BlueShield = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 130, 260, 390, 520, 0, 130, 260, 390, 520],
        top: [1560, 1560, 1560, 1560, 1560, 1690, 1690, 1690, 1690, 1690],
      },
    },
    width: 130,
    height: 130,
    above: true,
    autoSize: true,
    duration: 60000,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.MaelStorm = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [2, 70, 130, 195, 252, 312, 372, 430, 492, 554],
        top: [2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870, 2870],
      },
    },
    width: 60,
    height: 60,
    above: true,
    autoSize: true,
    duration: 18000, //Normal 12 sec
    frame: {
      burst: 10,
    },
  },
});
BurstStore.RedShield = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [650, 780, 910, 1040, 1170, 650, 780, 910, 1040, 1170],
        top: [1560, 1560, 1560, 1560, 1560, 1690, 1690, 1690, 1690, 1690],
      },
    },
    width: 130,
    height: 130,
    above: true,
    autoSize: true,
    duration: 18000, //Normal 12 sec
    frame: {
      burst: 10,
    },
  },
});
BurstStore.BurningCircle = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 112, 224, 336, 448, 560],
        top: [1820, 1820, 1820, 1820, 1820, 1820],
      },
    },
    width: 112,
    height: 126,
    above: true,
    autoSize: true,
    duration: 18000,
    frame: {
      burst: 6,
    },
  },
});
BurstStore.Irradiate = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [668, 792, 916, 1042, 1172],
        top: [1820, 1820, 1820, 1820, 1820],
      },
    },
    width: 126,
    height: 110,
    above: true,
    autoSize: true,
    duration: 30000,
    frame: {
      burst: 5,
    },
  },
});
BurstStore.Recall = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 86, 188, 282, 386, 488, 588, 688, 788, 894],
        top: [1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938, 1938],
      },
    },
    width: 98,
    height: 98,
    frame: {
      burst: 10,
    },
  },
});
BurstStore.Ice = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1024, 1164, 1304, 1444],
        top: [1942, 1942, 1942, 1942],
      },
    },
    width: 78,
    height: 88,
    above: true,
    autoSize: true,
    duration: 30000,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.EMPShockwave = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 180, 356, 534, 708, 886, 1068],
        top: [2038, 2038, 2038, 2038, 2038, 2038, 2038],
      },
    },
    width: 180,
    height: 146,
    scale: 1.5,
    frame: {
      burst: 7,
    },
  },
});
BurstStore.StasisFieldSpell = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1384, 1250, 1250, 1384],
        top: [2044, 2044, 2044, 2044],
      },
    },
    width: 128,
    height: 84,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.MaelStormSpell = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [1384, 1250, 1250, 1384],
        top: [2134, 2134, 2134, 2134],
      },
    },
    width: 128,
    height: 84,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.Restoration = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          0, 128, 256, 384, 512, 640, 768, 896, 0, 128, 256, 384, 512, 640, 768,
          896,
        ],
        top: [
          2190, 2190, 2190, 2190, 2190, 2190, 2190, 2190, 2318, 2318, 2318,
          2318, 2318, 2318, 2318, 2318,
        ],
      },
    },
    width: 128,
    height: 128,
    above: true,
    autoSize: true,
    frame: {
      burst: 16,
    },
  },
});
BurstStore.Shockwave = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [0, 135, 270, 405, 540, 675, 810, 945, 1080, 1215, 1350],
        top: [2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446, 2446],
      },
    },
    width: 135,
    height: 120,
    frame: {
      burst: 11,
    },
  },
});
BurstStore.NuclearStrike = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [
          0, 154, 308, 462, 616, 770, 924, 1078, 1232, 1386, 0, 154, 308, 462,
          616, 770, 924, 1078, 1232, 1386,
        ],
        top: [
          2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2562, 2716,
          2716, 2716, 2716, 2716, 2716, 2716, 2716, 2716, 2716,
        ],
      },
    },
    width: 154,
    height: 154,
    scale: 2.5,
    frame: {
      burst: 20,
    },
  },
});
//Evolve related
BurstStore.EvolveGroundUnit = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [524, 562, 600, 638, 676, 714, 524, 562, 600, 638, 676, 714],
        top: [724, 724, 724, 724, 724, 724, 766, 766, 766, 766, 766, 766],
      },
    },
    width: 38,
    height: 43,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.EvolveFlyingUnit = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'Magic',
    imgPos: {
      burst: {
        left: [438, 501, 564, 627, 690, 438, 501, 564, 627],
        top: [810, 810, 810, 810, 810, 855, 855, 855, 855],
      },
    },
    width: 63,
    height: 46,
    frame: {
      burst: 9,
    },
  },
});
BurstStore.SmallMutationComplete = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [1316, 1476, 1636, 1796],
        top: [962, 962, 962, 962],
      },
    },
    width: 88,
    height: 84,
    frame: {
      burst: 4,
    },
  },
});
BurstStore.MiddleMutationComplete = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [980, 1140, 1300],
        top: [1048, 1048, 1048],
      },
    },
    width: 120,
    height: 112,
    frame: {
      burst: 3,
    },
  },
});
BurstStore.LargeMutationComplete = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [960, 1120, 1280],
        top: [1160, 1160, 1160],
      },
    },
    width: 160,
    height: 150,
    frame: {
      burst: 3,
    },
  },
});
BurstStore.ProtossBuildingComplete = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ProtossBuilding',
    imgPos: {
      burst: {
        left: [486, 486, 486, 636, 636, 636],
        top: [648, 648, 648, 648, 648, 648],
      },
    },
    width: 152,
    height: 152,
    frame: {
      burst: 6,
    },
  },
});
//Damaged related
BurstStore.redFireL = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'TerranBuilding',
    imgPos: {
      burst: {
        left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
        top: [546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546, 546],
      },
    },
    width: 40, //64N+14
    height: 70,
    above: true,
    //Keep playing until killed
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.redFireM = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'TerranBuilding',
    imgPos: {
      burst: {
        left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
        top: [632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632, 632],
      },
    },
    width: 40, //64N+14
    height: 70,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.redFireR = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'TerranBuilding',
    imgPos: {
      burst: {
        left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
        top: [722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722, 722],
      },
    },
    width: 48, //64N+10
    height: 60,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.blueFireL = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ProtossBuilding',
    imgPos: {
      burst: {
        left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
        top: [424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424, 424],
      },
    },
    width: 40, //64N+14
    height: 70,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.blueFireM = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ProtossBuilding',
    imgPos: {
      burst: {
        left: [14, 78, 142, 206, 270, 334, 398, 462, 526, 590, 654, 718],
        top: [506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506, 506],
      },
    },
    width: 40, //64N+14
    height: 70,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.blueFireR = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ProtossBuilding',
    imgPos: {
      burst: {
        left: [10, 74, 138, 202, 266, 330, 394, 458, 522, 586, 650, 714],
        top: [588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588, 588],
      },
    },
    width: 48, //64N+10
    height: 60,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.bloodA = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
        top: [
          1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320,
          1320,
        ],
      },
    },
    width: 64,
    height: 50,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.bloodB = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [
          768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472,
        ],
        top: [
          1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320, 1320,
          1320,
        ],
      },
    },
    width: 64,
    height: 50,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.bloodC = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [0, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704],
        top: [
          1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376,
          1376,
        ],
      },
    },
    width: 64,
    height: 50,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});
BurstStore.bloodD = Burst.extends({
  constructorPlus: function (props) {
    //Nothing
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    imgPos: {
      burst: {
        left: [
          768, 832, 896, 960, 1024, 1088, 1152, 1216, 1280, 1344, 1408, 1472,
        ],
        top: [
          1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376, 1376,
          1376,
        ],
      },
    },
    width: 64,
    height: 50,
    above: true,
    forever: true,
    frame: {
      burst: 12,
    },
  },
});

export default BurstStore;
