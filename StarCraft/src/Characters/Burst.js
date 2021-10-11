import GlobalObject from './GlobalObject';

//One animation period which only play for a while and die
class Burst extends GlobalObject {
  static allEffects = [];

  constructor(props) {
    super(props);
    //Behavior like effect on target
    if (props.target) {
      this.target = props.target;
      //Ahead of owner
      if (props.above) this.above = true;
      //Animation duration
      //Match owner size
      if (props.autoSize) this.autoSize = true;
      //Resize drawing by scale
      var times = this.scale ? this.scale : 1;
      if (this.autoSize != null) {
        //Can mix autoSize with scale
        switch (this.autoSize) {
          case 'MAX':
            this.scale =
              (Math.max(this.target.width, this.target.height) * 2 * times) /
              (this.width + this.height);
            break;
          case 'MIN':
            this.scale =
              (Math.min(this.target.width, this.target.height) * 2 * times) /
              (this.width + this.height);
            break;
          default:
            this.scale =
              ((this.target.width + this.target.height) * times) /
              (this.width + this.height);
        }
        times = this.scale;
      }
      //Location
      this.x = (this.target.posX() - (this.width * times) / 2) >> 0;
      this.y = (this.target.posY() - (this.height * times) / 2) >> 0;
    }
    //Independent burst
    else {
      //Target location, from centerP to top-left
      let times = this.scale ? this.scale : 1;
      this.x = props.x - (this.width * times) / 2;
      this.y = props.y - (this.height * times) / 2;
    }
    //Play duration
    if (this.forever) this.duration = -1; //Keep playing until killed
    if (props.duration != null) this.duration = props.duration; //Override duration
    //Resize if set scale
    if (props.scale) this.scale = props.scale;
    //Restore callback after burst finish
    if (props.callback) this.callback = props.callback;
    //By default it will burst
    this.burst();
    //Will show after constructed
    Burst.allEffects.push(this);
  }
  //Override GlobalObject method
  animeFrame() {
    //Animation play
    this.action++;
    //Override GlobalObject here, can have hidden frames
    var arrLimit =
      this.imgPos[this.status].left instanceof Array
        ? this.imgPos[this.status].left.length
        : 1;
    if (this.action == this.frame[this.status] || this.action == arrLimit) {
      this.action = 0;
    }
    //Update location here
    if (this.above && this.target) {
      //Update location: copied from constructor
      var times = this.scale ? this.scale : 1;
      this.x = (this.target.posX() - (this.width * times) / 2) >> 0;
      this.y = (this.target.posY() - (this.height * times) / 2) >> 0;
    }
  }
  burst() {
    this.status = 'burst';
    //Start play burst animation
    var myself = this;
    this._timer = setInterval(function () {
      //Only play animation, will not move
      myself.animeFrame();
    }, 100);
    //Will die(stop playing) after time limit arrive
    var duration = this.duration ? this.duration : this.frame['burst'] * 100;
    //Last forever if duration<0 (-1)
    if (duration > 0) {
      setTimeout(function () {
        myself.die();
      }, duration);
    }
  }
  die() {
    //Run callback when burst die
    if (this.callback) this.callback();
    super.die.call(this);
  }
}

export default Burst;
