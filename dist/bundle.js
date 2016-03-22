/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _game = __webpack_require__(2);

	var _game2 = _interopRequireDefault(_game);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.g = new _game2.default({ min: 1, max: 10 });

/***/ },
/* 1 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _gameState = __webpack_require__(3);

	var _gameState2 = _interopRequireDefault(_gameState);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NumberGame = function () {
		function NumberGame() {
			var _this = this;

			var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			var _ref$min = _ref.min;
			var min = _ref$min === undefined ? 0 : _ref$min;
			var _ref$max = _ref.max;
			var max = _ref$max === undefined ? 10 : _ref$max;
			var _ref$user = _ref.user;
			var user = _ref$user === undefined ? "Anonymus" : _ref$user;

			_classCallCheck(this, NumberGame);

			this.currentNumber;
			this.currentRoundState = null;
			this.shots = 0;
			this.roundFinished = true;
			this.game = _gameState2.default;
			this.game.addListener(function () {
				_this.render();
			});

			this.roundBtn = document.getElementById('new_round');
			this.number = document.getElementById('number');
			this.resetBtn = document.getElementById('reset');
			this.statsConsole = document.getElementById('stats_view');
			this.numbersButtons = document.getElementById('numbers');

			this.dataLoaded = this.loadState();

			/*
	  	if user continues game from previous session ignore parameters passed to constructor
	  */
			if (!this.dataLoaded) {
				this.setRange(min, max);
				this.game.user = user;
			}

			this.initDomEvemnts();
		}

		_createClass(NumberGame, [{
			key: 'initDomEvemnts',
			value: function initDomEvemnts() {
				var self = this;

				this.roundBtn.addEventListener('click', function () {
					self.round();
				}, false);

				this.resetBtn.addEventListener('click', function () {
					self.finish();
				}, false);

				this.numbersButtons.addEventListener('click', function (e) {
					var n = e.target.getAttribute('data-number');
					n = parseInt(n, 10);
					self.guess(n);
				}, false);
			}
		}, {
			key: 'render',
			value: function render() {
				this.numbersButtons.innerHTML = this.printNumbers();
				this.statsConsole.innerHTML = this.stats();
			}
		}, {
			key: 'printNumbers',
			value: function printNumbers() {
				var range = this.game.range;
				var min = range[0];
				var max = range[1];
				var n = min;
				var str = '';
				while (n <= max) {
					str += '<button data-number="' + n + '" type="button">' + n + '</button>';
					n++;
				}
				return str;
			}
		}, {
			key: 'round',
			value: function round() {
				if (!this.roundFinished) {
					this.currentRoundState.comp = 1;
					this.saveState();
				}
				this.roundFinished = false;
				this.shots = 0;
				this.currentNumber = this.drawLots();
				this.currentRoundState = {
					comp: 0,
					user: 0,
					n: this.currentNumber,
					shots: 0
				};
				this.game.addNewState(this.currentRoundState);
				this.saveState();
			}
		}, {
			key: 'guess',
			value: function guess(x) {
				this.shots++;
				if (this.roundFinished) {
					return;
				}
				if (x === this.currentNumber) {
					//user wins
					this.currentRoundState.user = 1;
					this.roundFinished = true;
				} else {
					//game continues
					var remainedTries = 3 - this.shots;
					if (!remainedTries) {
						this.currentRoundState.comp = 1;
						this.roundFinished = true;
					}
				}
				this.currentRoundState.shots = this.shots;
				this.saveState();
			}
		}, {
			key: 'finish',
			value: function finish() {
				this.roundFinished = true;
				this.game.reset();
			}
		}, {
			key: 'setUser',
			value: function setUser(name) {
				this.game.user = name;
				this.saveState();
			}
		}, {
			key: 'setRange',
			value: function setRange(min, max) {
				if (max - min < 4) {
					max = min + 4;
					console.log("Range must include at least 4 numbers.");
				}
				this.game.range = [min, max];
				this.finish(); //reset stats
			}
		}, {
			key: 'stats',
			value: function stats() {
				var state = this.game.state;;
				var l = state.length;
				var c = 0;
				var u = 0;
				var walkovers = 0;
				if (l === 0) {
					return "There is no ongoing game";
				}

				var _calculateTotalResult = this.calculateTotalResult(state);

				var _calculateTotalResult2 = _slicedToArray(_calculateTotalResult, 3);

				var c = _calculateTotalResult2[0];
				var u = _calculateTotalResult2[1];
				var walkovers = _calculateTotalResult2[2]; // desctructuring :D

				var user = this.game.user;
				var range = this.game.range;
				var min = range[0];
				var max = range[1];

				//last round data
				var lastRound = state[l - 1];
				var lastRoundComputer = lastRound.comp;
				var lastRoundUser = lastRound.user;
				var resultTxt = '';

				//prepare stats content
				if (this.roundFinished) {
					//round final result
					resultTxt = lastRoundComputer ? 'You lost :/' : 'You win. Congrats!';
					resultTxt += '<br/>Start new round to continue';
				} else {
					// ongoing round content
					var attemptResultTxt = lastRound.shots > 0 ? 'Wrong. Try again ' : 'Guess'; // texts for ongoing round
					var ongoingRoundTxt = attemptResultTxt + ' (' + min + ' - ' + max + ')';
					resultTxt += ongoingRoundTxt + ' <br/>You still have ' + (3 - this.shots) + ' attempts';
				}
				//stats full text template
				var statsText = '<p>' + resultTxt + '</p>\n\t\t<h3>Computer ' + c + ' : ' + u + ' ' + user + '</h3>';

				return statsText;
			}
		}, {
			key: 'calculateTotalResult',
			value: function calculateTotalResult(state) {
				var c = 0;
				var u = 0;
				var walkovers = 0;
				state.forEach(function (v, i) {
					u += v.user;
					c += v.comp;
					if (v.comp === 1 && v.shots < 3) {
						walkovers++;
					}
				});
				return [c, u, walkovers];
			}
		}, {
			key: 'drawLots',
			value: function drawLots() {
				var range = this.game.range;
				var min = range[0];
				var max = range[1];
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		}, {
			key: 'saveState',
			value: function saveState() {
				this.game.currentState = this.currentRoundState;
				this.game.saveGameData();
			}
		}, {
			key: 'loadState',
			value: function loadState() {
				var answer = confirm("Do you want load previous game?");
				if (!answer) {
					return false;
				}
				var dataLoaded = this.game.loadGameData();
				if (dataLoaded === false) {
					return false;
				}

				var gameState = this.game.state;
				var rounds = gameState.length;
				//init properties
				this.currentRoundState = gameState[rounds - 1];
				this.currentNumber = this.currentRoundState.n;
				this.shots = this.currentRoundState.shots;
				this.roundFinished = this.checkIfGameFinished();

				this.render();
				return true;
			}
		}, {
			key: 'checkIfGameFinished',
			value: function checkIfGameFinished() {
				return this.currentRoundState.user || this.currentRoundState.comp;
			}
		}]);

		return NumberGame;
	}();

	;

	exports.default = NumberGame;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _events = __webpack_require__(1);

	var userName = '';
	var gameState = [];
	var min = 0;
	var max = 0;
	var emitter = new _events.EventEmitter();

	var state = {
		addNewState: function addNewState(state) {
			gameState.push(state);
			emitter.emit('change');
		},
		saveGameData: function saveGameData() {
			localStorage.setItem("game", JSON.stringify(this.gameData));
		},
		loadGameData: function loadGameData() {
			var gameString = localStorage.getItem("game");
			if (gameString === null) {
				return false;
			}
			var gameDataObject = JSON.parse(gameString);
			this.gameData = gameDataObject;
			return true;
		},
		reset: function reset() {
			gameState = [];
			localStorage.removeItem("game");
			emitter.emit('change');
		},
		addListener: function addListener(callback) {
			emitter.on('change', callback);
		}
	};

	//define properties with getters and setters
	Object.defineProperty(state, 'user', {
		get: function get() {
			return userName;
		},
		set: function set(name) {
			userName = name;
			emitter.emit('change');
		}
	});

	Object.defineProperty(state, 'range', {
		set: function set(values) {
			min = values[0];
			max = values[1];
			emitter.emit('change');
		},
		get: function get() {
			return [min, max];
		}
	});

	Object.defineProperty(state, 'gameData', {
		get: function get() {
			return {
				gameState: gameState,
				min: min,
				max: max,
				user: userName
			};
		},
		set: function set(data) {
			gameState = data.gameState;
			min = data.min;
			max = data.max;
			userName = data.user;
			emitter.emit('change');
		}
	});

	Object.defineProperty(state, 'currentState', {
		set: function set(state) {
			gameState[gameState.length - 1] = state;
			emitter.emit('change');
		}
	});

	Object.defineProperty(state, 'state', {
		get: function get() {
			return gameState;
		}
	});

	exports.default = state;

/***/ }
/******/ ]);