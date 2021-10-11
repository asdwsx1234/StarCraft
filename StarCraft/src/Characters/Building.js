import GlobalObject from './GlobalObject';
import BurstStore from './BurstStore';
import { Unit, AttackableUnit } from '../Characters/Units';

class Building extends GlobalObject {
  constructor(props) {
    super(props);
    //Add id for building
    this.id = Unit.currentID++;
    this.isEnemy = Boolean(props.isEnemy); //false by default
    this.life = this.get('HP');
    if (this.SP) this.shield = this.get('SP');
    if (this.MP) this.magic = 50;
    this.selected = false;
    this.isFlying = false;
    // Finish below after fully constructed, postpone
    var myself = this;
    setTimeout(function () {
      //Add this unit into Game
      Building.allBuildings.push(myself);
      if (myself.isEnemy) Building.enemyBuildings.push(myself);
      else Building.ourBuildings.push(myself);
      //Show unit
      myself.dock();
    }, 0);
  }

  //Override to support multiple hidden frames
  animeFrame() {
    //Animation play
    this.action++;
    //Override GlobalObject here, building doesn't have direction
    var arrLimit =
      this.imgPos[this.status].left instanceof Array
        ? this.imgPos[this.status].left.length
        : 1;
    if (this.action == this.frame[this.status] || this.action >= arrLimit)
      this.action = 0;
    //Multiple hidden frames support
    if (this.imgPos[this.status].left[this.action] == -1) this.action = 0;
  }
  //Dock means stop moving but keep animation
  dock() {
    //Clear old timer
    this.stop();
    //Launch new dock timer
    this.status = 'dock';
    var myself = this;
    this._timer = setInterval(function () {
      //Only play animation, will not move
      myself.animeFrame();
    }, 100);
  }
  //Cannot move
  moving() {
    //Nothing
  }
  //Override for sound effect
  die() {
    //Old behavior
    GlobalObject.prototype.die.call(this);
    this.life = 0;
    //If has sound effect
    if (this.sound.death && this.insideScreen()) {
      this.sound.death.play();
    }
  }
  reactionWhenAttackedBy(enemy) {
    //Cannot fight back or escape
    //Resign and give reward to enemy if has no life before dead
    if (this.life <= 0) {
      //If multiple target, only die once and give reward
      if (this.status != 'dead') {
        //Killed by enemy
        this.die();
        //Give enemy reward
        enemy.kill++;
      }
    }
  }
  //Fix bug, for consistent, cause 100% damage on building
  calculateDamageBy(enemyObj) {
    return enemyObj instanceof GlobalObject ? enemyObj.get('damage') : enemyObj;
  }
  //Calculate damage, for consistence
  getDamageBy(enemy, percent) {
    if (percent == undefined) percent = 1; //100% by default
    var damage = 0;
    //If has SP and shield remain
    if (this.shield > 0) {
      damage =
        ((this.calculateDamageBy(enemy) - this.get('plasma')) * percent) >> 0;
      if (damage < 1) damage = 1;
      this.shield -= damage;
      if (this.shield < 0) {
        //Inherit damage
        this.life += this.shield;
        this.shield = 0;
      }
    } else {
      damage = ((enemy.get('damage') - this.get('armor')) * percent) >> 0;
      if (damage < 1) damage = 1;
      this.life -= damage;
    }
  }
  //Life status
  lifeStatus() {
    var lifeRatio = this.life / this.get('HP');
    return lifeRatio > 0.7 ? 'green' : lifeRatio > 0.3 ? 'yellow' : 'red';
  }
}

Building.prototype.name = 'Building';
Building.prototype.armor = 0;
Building.prototype.sight = 385;

//Store all buildings
Building.allBuildings = [];
Building.ourBuildings = [];
Building.enemyBuildings = [];

//Zerg buildings
Building.ZergBuilding = Building.extends({
  constructorPlus: function (props) {
    this.sound = {
      selected: new Audio('bgm/ZergBuilding.selected.wav'),
      death: new Audio('bgm/ZergBuilding.death.wav'),
    };
    //Need draw mud for it
    Map.needRefresh = 'MAP';
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ZergBuilding',
    portraitOffset: { x: 0, y: 168 },
    dieEffect: BurstStore.ZergBuildingBurst,
    recover: function () {
      if (this.life < this.get('HP')) this.life += 0.5;
      if (this.magic != undefined && this.magic < this.get('MP'))
        this.magic += 0.5;
    },
  },
});
//Terran buildings
Building.TerranBuilding = Building.extends({
  constructorPlus: function (props) {
    this.sound = {
      selected: new Audio('bgm/TerranBuilding.selected.wav'),
      death: new Audio('bgm/TerranBuilding.death.wav'),
    };
  },
  prototypePlus: {
    //Add basic unit info
    name: 'TerranBuilding',
    portraitOffset: { x: 780, y: 56 },
    dieEffect: BurstStore.TerranBuildingBurst,
    recover: function () {
      if (this.magic != undefined && this.magic < this.get('MP'))
        this.magic += 0.5;
    },
  },
});
//Protoss buildings
Building.ProtossBuilding = Building.extends({
  constructorPlus: function (props) {
    this.sound = {
      selected: new Audio('bgm/ProtossBuilding.selected.wav'),
      death: new Audio('bgm/ProtossBuilding.death.wav'),
    };
  },
  prototypePlus: {
    //Add basic unit info
    name: 'ProtossBuilding',
    plasma: 0,
    portraitOffset: { x: 900, y: 112 },
    dieEffect: BurstStore.ProtossBuildingBurst,
    recover: function () {
      if (this.shield < this.get('SP')) this.shield += 0.5;
      if (this.magic != undefined && this.magic < this.get('MP'))
        this.magic += 0.5;
    },
  },
});
//Attackable interface
Building.Attackable = {
  constructorPlus: function (props) {
    this.attackTimer = 0;
    this.bullet = {};
    this.kill = 0;
    this.target = {};
    //Idle by default
    this.targetLock = false;
    //Can fire by default
    this.coolDown = true;
  },
  prototypePlus: {
    //Add basic unit info
    name: 'AttackableBuilding',
    isInAttackRange: AttackableUnit.prototype.isInAttackRange,
    matchAttackLimit: AttackableUnit.prototype.matchAttackLimit,
    attack: function (enemy) {
      // FIXME: 循环依赖，放到Referee里去实现了
    },
    stopAttack: AttackableUnit.prototype.stopAttack,
    findNearbyTargets: function () {
      //Initial
      var units,
        buildings,
        results = [];
      //Only ours
      if (this.isEnemy) {
        units = Unit.allOurUnits();
        buildings = Building.ourBuildings;
      }
      //Only enemies
      else {
        units = Unit.allEnemyUnits();
        buildings = Building.enemyBuildings;
      }
      var myself = this;
      [units, buildings].forEach(function (charas) {
        var myX = myself.posX();
        var myY = myself.posY();
        charas = charas
          .filter(function (chara) {
            return (
              !chara.isInvisible &&
              myself.isInAttackRange(chara) &&
              myself.matchAttackLimit(chara)
            );
          })
          .sort(function (chara1, chara2) {
            var X1 = chara1.posX(),
              Y1 = chara1.posY(),
              X2 = chara2.posX(),
              Y2 = chara1.posY();
            return (
              (X1 - myX) * (X1 - myX) +
              (Y1 - myY) * (Y1 - myY) -
              (X2 - myX) * (X2 - myX) -
              (Y2 - myY) * (Y2 - myY)
            );
          });
        results = results.concat(charas);
      });
      //Only attack nearest one, unit prior to building
      return results;
    },
    highestPriorityTarget: AttackableUnit.prototype.highestPriorityTarget,
    AI: function () {
      //Dead unit doesn't have following AI
      if (this.status == 'dead') return;
      //AI:Attack insight enemy automatically when alive
      if (this.isAttacking()) {
        // target ran out of attack range
        if (this.cannotReachTarget()) {
          //Forgive target and find other target
          this.stopAttack();
          this.targetLock = false;
        }
      } else {
        //Find another in-range enemy
        var enemy = this.highestPriorityTarget();
        //Change target if has one
        if (enemy) this.attack(enemy);
      }
    },
    isAttacking: AttackableUnit.prototype.isAttacking,
    cannotReachTarget: function () {
      return !this.isInAttackRange(this.target);
    },
    isMissingTarget: AttackableUnit.prototype.isMissingTarget,
    isReloaded: AttackableUnit.prototype.isReloaded,
    //Override for attackable unit
    die: function () {
      //Old behavior
      Building.prototype.die.call(this);
      //Clear new timer for unit
      this.stopAttack();
      this.selected = false;
    },
  },
};

// Patch, 如果放在GlobalObject文件里定义，import Building会导致循环引用
GlobalObject.prototype.cannotMove = function () {
  return this instanceof Building || Boolean(this.burrowBuffer);
};

export default Building;
