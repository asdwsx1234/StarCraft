//Gobj is original object used in StarCraft
class GlobalObject {
  static detectorBuffer = { isInvisible: false };

  detectOutOfBound() {
    //Do nothing here
  }
  updateLocation() {
    //Override here
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  animeFrame() {
    //Animation play
    this.action++;
    if (this.action >= this.frame[this.status]) {
      this.action = 0;
    }
  }

  moving() {
    //Clear old timer
    this.stop();
    //Launch new moving timer
    this.status = 'moving';
    var myself = this;
    var movingFrame = function () {
      myself.animeFrame();
      //Relocate character
      myself.updateLocation();
      //Detect OutOfBound
      myself.detectOutOfBound();
    };
    movingFrame(); //Add one missing frame
    this._timer = setInterval(movingFrame, 100);
  }

  stop() {
    //Clear both kinds of timer
    clearInterval(this._timer);
    clearTimeout(this._timer);
    //this.status="stop";
    this._timer = -1; //Reset to default
  }

  die() {
    //Clear old timer
    this.stop();
    this.status = 'dead';
    this.action = 0;
    //If has die animation
    if (this.dieEffect) {
      new this.dieEffect({ x: this.posX(), y: this.posY() });
    }
  }

  include(obj) {
    return (
      obj.posY() > this.y &&
      obj.posY() < this.y + this.height &&
      obj.posX() > this.x &&
      obj.posX() < this.x + this.width
    );
  }

  includePoint(x, y) {
    return (
      y > this.y &&
      y < this.y + this.height &&
      x > this.x &&
      x < this.x + this.width
    );
  }

  insideSquare(rect) {
    if (rect.radius instanceof Array)
      return (
        Math.abs(rect.centerX - this.posX()) < rect.radius[0] &&
        Math.abs(rect.centerY - this.posY()) < rect.radius[1]
      );
    else
      return (
        Math.abs(rect.centerX - this.posX()) < rect.radius &&
        Math.abs(rect.centerY - this.posY()) < rect.radius
      );
  }

  insideRect(rect) {
    return (
      this.posX() > rect.start.x &&
      this.posX() < rect.end.x &&
      this.posY() > rect.start.y &&
      this.posY() < rect.end.y
    );
  }
  insideCircle(circle) {
    return (
      Math.pow(circle.centerX - this.posX(), 2) +
        Math.pow(circle.centerY - this.posY(), 2) <
      Math.pow(circle.radius, 2)
    );
  }

  inside = this.insideCircle;

  radius() {
    return this.width < this.height ? this.width / 2 : this.height / 2; //Math.min
  }

  distanceFrom = function (obj) {
    if (obj instanceof GlobalObject) {
      return Math.pow(
        (this.posX() - obj.posX()) * (this.posX() - obj.posX()) +
          (this.posY() - obj.posY()) * (this.posY() - obj.posY()),
        0.5
      );
    } else {
      return Math.pow(
        (this.posX() - obj.x) * (this.posX() - obj.x) +
          (this.posY() - obj.y) * (this.posY() - obj.y),
        0.5
      );
    }
  };
  insideScreen() {
    // FIXME: 放到Map文件去修改，否则会造成循环依赖
  }
  isIdle() {
    return this.status == 'dock';
  }
  canSee(enemy) {
    return enemy.inside({
      centerX: this.posX(),
      centerY: this.posY(),
      radius: this.get('sight'),
    });
  }
  get(prop) {
    //Currently only support upgrade for unit properties, no buildings
    var result = eval('this.' + prop); //Can get A.B.C
    //ShareFlag is symbol for team sharing array, not speed matrix array
    if (result instanceof Array && result.shareFlag)
      return result[Number(this.isEnemy)];
    else return result;
  }

  addBuffer(bufferObj, onAll) {
    // FIXME: 放到Button文件去修改，否则会造成循环依赖
  }
  removeBuffer(bufferObj) {
    // FIXME: 放到Button文件去修改，否则会造成循环依赖
  }
  cannotMove() {
    // FIXME: 放到Building文件去修改，否则会造成循环依赖
  }
  evolveTo(charaType, burstArr) {
    // FIXME: 放到BurstStore文件去修改，否则会造成循环依赖
  }

  posX() {
    return this.x + this.width / 2;
  }

  posY() {
    return this.y + this.height / 2;
  }

  constructor({ x, y, target }) {
    this.x = x;
    this.y = y;
    if (target instanceof GlobalObject) {
      this.x = (target.posX() - this.width / 2) >> 0;
      this.y = (target.posY() - this.height / 2) >> 0;
    }
    this.action = 0; //Only for moving
    this.status = '';
    this.buffer = {}; //Buffer names
    this.override = {}; //Buffer effects
    this.bufferObjs = [];
    this._timer = -1;
    //Closure
    var _private = { _timer: -1 };
    this.getP = function (attr) {
      if (attr) return _private[attr];
      else return _private;
    };
    this.setP = function (attr, value) {
      _private[attr] = value;
    };
  }
}

GlobalObject.prototype.name = 'Gobj';
GlobalObject.prototype.width = 0;
GlobalObject.prototype.height = 0;
GlobalObject.prototype.imgPos = {
  moving: {
    left: [0, 0, 0, 0, 0, 0, 0, 0],
    top: [0, 0, 0, 0, 0, 0, 0, 0],
  },
};
GlobalObject.prototype.frame = {
  moving: 1,
};
GlobalObject.prototype.speed = { x: 0, y: 0 };

export default GlobalObject;
