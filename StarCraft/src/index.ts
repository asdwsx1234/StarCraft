import './css/style.css';
import './css/mapStyle.css';
import './css/buttonStyle.css';
import './css/portraitStyle.css';

import * as $ from 'jquery';
import './Utils/gFrame';
import Game from './GameRule/Game.js';

$('body')[0].onload = function () {
  Game.init();
};
