(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var CoreClass, DocumentsManager, PanelHelper, com;

  DocumentsManager = require('./coreClass/DocumentsManager');

  PanelHelper = require('./coreClass/PanelHelper');

  com = require('./coreClass/com');

  module.exports = CoreClass = (function() {
    CoreClass.create = function(globalScope) {
      var fn, instance;
      fn = function() {};
      instance = new CoreClass(fn, globalScope);
      fn.__proto__ = instance;
      return fn;
    };

    function CoreClass(_fn, global) {
      this._fn = _fn;
      this.global = global;
      this.com = com;
      this.docs = new DocumentsManager(this);
    }

    CoreClass.prototype.panel = function(name, cb) {
      new PanelHelper(this, name, cb);
    };

    return CoreClass;

  })();

}).call(this);

},{"./coreClass/DocumentsManager":3,"./coreClass/PanelHelper":4,"./coreClass/com":5}],2:[function(require,module,exports){
(function() {
  var CoreClass, JSON, console;

  CoreClass = require('./CoreClass');

  console = require('./tools/console');

  JSON = require('./tools/JSON');

  $.global.console = console;

  $.global.JSON = JSON;

  module.exports = CoreClass.create($.global);

}).call(this);

},{"./CoreClass":1,"./tools/JSON":12,"./tools/console":13}],3:[function(require,module,exports){
(function() {
  var Document, DocumentsManager, desc, exec, _ref;

  Document = require('./documentsManager/Document');

  _ref = require('./com'), desc = _ref.desc, exec = _ref.exec;

  module.exports = DocumentsManager = (function() {
    function DocumentsManager(_core) {
      this._core = _core;
      this.active = new Document(this);
    }

    DocumentsManager.prototype.getActiveDomDoc = function() {};

    return DocumentsManager;

  })();

}).call(this);

},{"./com":5,"./documentsManager/Document":10}],4:[function(require,module,exports){
(function() {
  var PanelHelper;

  module.exports = PanelHelper = (function() {
    function PanelHelper(_core, panelName, cb) {
      var core;
      this._core = _core;
      if (this._core.global._panels == null) {
        this._core.global._panels = {};
      }
      core = this._core;
      this._core.global._panels[panelName] = function(args) {
        var doc, domDoc, error, msg, result, run;
        result = null;
        run = function() {
          console.useAlert();
          result = cb(args);
          return console.useLog();
        };
        try {
          try {
            doc = core.docs.active;
            domDoc = doc.asDom();
          } catch (_error) {}
          if (domDoc != null) {
            domDoc.suspendHistory(panelName, 'run()');
          } else {
            run();
          }
          return "ok;" + result;
        } catch (_error) {
          error = _error;
          msg = error;
          if (error.message != null) {
            msg = error.message;
          }
          alert(msg);
          return "er;" + console._inspectSingle(error);
        }
      };
    }

    return PanelHelper;

  })();

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  var ComInterface, com, name, _ref,
    __hasProp = {}.hasOwnProperty;

  module.exports = com = {};

  ComInterface = require('./com/ComInterface');

  com.instance = new ComInterface;

  _ref = com.instance;
  for (name in _ref) {
    if (!__hasProp.call(_ref, name)) continue;
    com[name] = com.instance[name];
  }

}).call(this);

},{"./com/ComInterface":7}],6:[function(require,module,exports){
(function() {
  var ActionExecuter, Desc, com;

  module.exports = ActionExecuter = (function() {
    function ActionExecuter(event, desc, showDialog) {
      this.event = event;
      if (showDialog == null) {
        showDialog = false;
      }
      this.showDialog = showDialog === true ? DialogModes.YES : DialogModes.NO;
      this.desc = Desc.descify(desc);
      this.result = executeAction(com.id(this.event), this.desc, this.showDialog);
    }

    return ActionExecuter;

  })();

  com = require('../com');

  Desc = require('./Desc');

}).call(this);

},{"../com":5,"./Desc":8}],7:[function(require,module,exports){
(function() {
  var ActionExecuter, ComInterface, Desc, Ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = ComInterface = (function() {
    function ComInterface() {
      this.id = __bind(this.id, this);
      this.ref = __bind(this.ref, this);
      this.desc = __bind(this.desc, this);
      this.get = __bind(this.get, this);
      this.exec = __bind(this.exec, this);
      this._unassignedIDStartsAt = (function() {
        var i;
        i = 2500;
        while (true) {
          i++;
          if (typeIDToStringID(i).length === 0) {
            break;
          }
        }
        return i;
      })();
    }

    ComInterface.prototype.idMaybeValid = function(id) {
      return id < this._unassignedIDStartsAt || id > this._unassignedIDStartsAt + 1000;
    };

    ComInterface.prototype.exec = function(event, desc, showDialog) {
      if (showDialog == null) {
        showDialog = false;
      }
      return new ActionExecuter(event, desc, showDialog);
    };

    ComInterface.prototype.get = function(ref) {
      ref = Ref.refify(ref);
      return new Desc(executeActionGet(ref));
    };

    ComInterface.prototype.desc = function() {
      return new Desc;
    };

    ComInterface.prototype.ref = function() {
      return new Ref;
    };

    ComInterface.prototype.id = function(what) {
      var id, str;
      if (typeof what === 'number') {
        if (!this.idMaybeValid(what)) {
          throw Error("typeID[" + what + "] doesn't seem to be valid");
        }
        str = typeIDToStringID(what);
        if (str.length === 0) {
          throw Error("typeID[" + what + "] doesn't translate to a stringID");
        }
        console.log("Use stringID '" + str + "' instead of typeID[" + what + "]");
        return what;
      }
      if (typeof what !== 'string') {
        throw Error("Can't find typeID for a non-string: '" + what + "'");
      }
      if (what.length === 0) {
        throw Error("Empty string/charID isn't valid");
      }
      if (what.length === 4) {
        id = charIDToTypeID(what);
        str = typeIDToStringID(id);
        if (str.length > 0) {
          console.log("Use stringID '" + str + "' instead of charID '" + what + "'");
          return id;
        }
      }
      id = stringIDToTypeID(what);
      if (!this.idMaybeValid(id)) {
        console.warn("stringID '" + what + "' doesn't seem to be valid");
      }
      return id;
    };

    return ComInterface;

  })();

  Ref = require('./Ref');

  Desc = require('./Desc');

  ActionExecuter = require('./ActionExecuter');

}).call(this);

},{"./ActionExecuter":6,"./Desc":8,"./Ref":9}],8:[function(require,module,exports){
(function() {
  var Desc, com;

  module.exports = Desc = (function() {
    var self;

    function Desc(descriptor) {
      if (descriptor == null) {
        descriptor = new ActionDescriptor;
      }
      this.descriptor = self.descify(descriptor);
    }

    Desc.prototype.obj = function(key, cls, desc) {
      this.descriptor.putObject(com.id(key), com.id(cls), self.descify(desc));
      return this;
    };

    Desc.prototype.unitDouble = function(key, unit, num) {
      this.descriptor.putUnitDouble(com.id(key), com.id(unit), num);
      return this;
    };

    Desc.prototype["enum"] = function(key, type, enumValue) {
      this.descriptor.putEnumerated(com.id(key), com.id(type), com.id(enumValue));
      return this;
    };

    Desc.prototype.getInt = function(key) {
      return this.descriptor.getInteger(com.id(key));
    };

    self = Desc;

    Desc.descify = function(desc) {
      if (desc instanceof Function) {
        desc = desc();
      }
      if (desc instanceof Desc) {
        return desc.descriptor;
      }
      if (!(desc instanceof ActionDescriptor)) {
        throw Error("The object is not an ActionDescriptor");
      }
      return desc;
    };

    return Desc;

  })();

  com = require('../com');

}).call(this);

},{"../com":5}],9:[function(require,module,exports){
(function() {
  var Ref, com;

  module.exports = Ref = (function() {
    var self;

    function Ref(reference) {
      if (reference == null) {
        reference = new ActionReference;
      }
      this.reference = self.refify(reference);
    }

    Ref.prototype.prop = function(cls, value) {
      this.reference.putProperty(com.id(cls), com.id(value));
      return this;
    };

    Ref.prototype["enum"] = function(cls, enumType, value) {
      this.reference.putEnumerated(com.id(cls), com.id(enumType), com.id(value));
      return this;
    };

    self = Ref;

    Ref.refify = function(ref) {
      if (ref instanceof Function) {
        ref = ref();
      }
      if (ref instanceof Ref) {
        return ref.reference;
      }
      if (!(ref instanceof ActionReference)) {
        throw Error("The object is not an ActionReference");
      }
      return ref;
    };

    return Ref;

  })();

  com = require('../com');

}).call(this);

},{"../com":5}],10:[function(require,module,exports){
(function() {
  var Document, GuidesManager;

  GuidesManager = require('./document/GuidesManager');

  module.exports = Document = (function() {
    function Document(_docs) {
      this._docs = _docs;
      this._core = this._docs._core;
      this.guides = new GuidesManager(this);
      this._dom = null;
      this._globalUnit = null;
    }

    Document.prototype.getGlobalUnit = function() {
      if (this._globalUnit == null) {
        this._globalUnit = this.asDom().width.type;
      }
      return this._globalUnit;
    };

    Document.prototype.globalUnitToPixels = function(n) {
      return (new UnitValue(n, this.getGlobalUnit())).as('px');
    };

    Document.prototype.asDom = function() {
      var doc;
      if (this._dom == null) {
        try {
          doc = app.activeDocument;
        } catch (_error) {
          $.sleep(500);
          exec('Wait', function() {
            return desc()["enum"]("Stte", "Stte", "RdCm");
          });
          doc = app.activeDocument;
        }
        this._dom = doc;
      }
      return this._dom;
    };

    return Document;

  })();

}).call(this);

},{"./document/GuidesManager":11}],11:[function(require,module,exports){
(function() {
  var GuidesManager, charToType, desc, exec, stringToChar, stringToType, typeToString, _ref,
    __slice = [].slice;

  _ref = require('../../com'), exec = _ref.exec, desc = _ref.desc, charToType = _ref.charToType, stringToType = _ref.stringToType, stringToChar = _ref.stringToChar, typeToString = _ref.typeToString;

  module.exports = GuidesManager = (function() {
    function GuidesManager(_doc) {
      this._doc = _doc;
      this._core = this._doc._core;
    }

    GuidesManager.prototype.addHorizontal = function() {
      var positions;
      positions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._add("horizontal", positions);
      return this;
    };

    GuidesManager.prototype.addVertical = function() {
      var positions;
      positions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._add("vertical", positions);
      return this;
    };

    GuidesManager.prototype._add = function(orientation, positions) {
      var pos, _i, _len;
      for (_i = 0, _len = positions.length; _i < _len; _i++) {
        pos = positions[_i];
        this._addSingle(orientation, pos);
      }
    };

    GuidesManager.prototype._addSingle = function(orientation, position) {
      exec('make', (function(_this) {
        return function() {
          return desc().obj('new', 'guide', function() {
            return desc().unitDouble('position', 'pixelsUnit', _this._doc.globalUnitToPixels(position))["enum"]('orientation', 'orientation', orientation);
          });
        };
      })(this));
    };

    return GuidesManager;

  })();

}).call(this);

},{"../../com":5}],12:[function(require,module,exports){
(function() {
  var JSON;

  module.exports = JSON = {};

  JSON.validate = function(string) {
    string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return /^[\],:{}\s]*$/.test(string);
  };

  JSON.parse = function(string) {
    if (typeof string !== 'string') {
      return null;
    }
    if (!JSON.validate(string)) {
      throw Error("The given json is not secure: '" + string + "'");
    }
    return eval("(" + string + ")");
  };

}).call(this);

},{}],13:[function(require,module,exports){
(function() {
  var console, prependToEachLine, self,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  module.exports = console = {
    inspectLimit: 100,
    "native": false,
    _useAlert: false,
    useAlert: function() {
      self._useAlert = true;
      return self;
    },
    useLog: function() {
      self._useAlert = false;
      return self;
    },
    _inspectSingle: function(given, persist) {
      var i, items, iterator, k, name, r, type, v, _i, _len, _ref, _ref1, _ref2;
      if (persist == null) {
        persist = {
          limit: console.inspectLimit,
          covered: []
        };
      }
      r = '';
      if (given === null) {
        return 'null';
      }
      if ((_ref = typeof given) === 'object' || _ref === 'function') {
        if (__indexOf.call(persist.covered, given) >= 0) {
          return '[Recursive]';
        } else {
          persist.covered.push(given);
        }
        items = [];
        iterator = function(v, k) {
          persist.limit--;
          if (persist.limit <= 0) {
            return;
          }
          k = k + " -> ";
          return items.push(k + console._inspectSingle(v, persist));
        };
        if (given instanceof Array) {
          type = 'array';
          for (i = _i = 0, _len = given.length; _i < _len; i = ++_i) {
            v = given[i];
            iterator(v, i);
          }
        } else {
          if (typeof given === 'function') {
            type = '#Function';
          } else {
            type = '#Object';
            if (((_ref1 = given.constructor) != null ? _ref1.name : void 0) != null) {
              name = given.constructor.name;
              if (name !== 'Object') {
                type = '#' + name;
              }
            }
          }
          for (k in given) {
            if (k === 'prototype' || k === 'parent') {
              continue;
            }
            try {
              v = given[k];
              iterator(v, k);
            } catch (_error) {}
          }
        }
        r = prependToEachLine("\n" + items.join(", \n"), '   ');
      } else if (given === void 0) {
        return 'undefined';
      } else if (typeof given === 'string') {
        if (given.length > 200) {
          given = given.substr(0, 200);
        }
        return '"' + given + '"';
      } else if ((_ref2 = typeof given) === 'boolean' || _ref2 === 'number') {
        return String(given);
      } else {
        r = given;
      }
      if (!type) {
        type = typeof given;
      }
      return type + ' -> ' + r;
    },
    _inspect: function(args) {
      var r, v;
      r = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          v = args[_i];
          _results.push(console._inspectSingle(v));
        }
        return _results;
      })();
      return r.join("   ");
    },
    _output: function(s) {
      if (self._useAlert) {
        alert(s);
      } else {
        $.write('\n----------------------\n' + s + '\n');
      }
    },
    log: function() {
      return self._output(self._inspect(arguments));
    },
    alert: function() {
      return alert(self._inspect.apply(self, arguments));
    },
    error: function(e) {
      if (typeof e === 'string') {
        self._output("Error: " + e);
        throw e;
      }
      self._output("Error: " + e.message + "\n", +"@" + e.sourceURL + ":" + e.line);
      throw e;
    },
    warn: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift('Warning');
      return this.log.apply(this, args);
    },
    typeOf: function(what) {
      if (what === null) {
        return 'null';
      }
      switch (typeof what) {
        case 'string':
          return 'String';
        case 'number':
          return 'Number';
        case 'boolean':
          return 'Boolean';
        case 'undefined':
          return 'undefined';
        case 'object':
          if (what instanceof Function) {
            return 'Function';
          }
          return '#' + what.constructor.name;
        default:
          return typeof what;
      }
    },
    notice: function() {
      args.unshift('Notice');
      return this.log.apply(this, args);
    },
    keys: function(obj) {
      var k, s, type, v;
      if (typeof obj !== 'object') {
        return this.console.apply(this, arguments);
      }
      s = '';
      for (k in obj) {
        try {
          v = obj[k];
          type = this.typeOf(v);
        } catch (_error) {
          type = '#inaccessible';
        }
        s += '\n   ' + k + ' -> ' + type;
      }
      this._output(s);
    }
  };

  self = console;

  prependToEachLine = function(str, toPrepend) {
    return String(str).split("\n").join("\n" + toPrepend);
  };

}).call(this);

},{}],14:[function(require,module,exports){
var _;

_ = require('photoshopjs-core');

require('./griddify');

require('./divide');

require('./wrap');

},{"./divide":15,"./griddify":16,"./wrap":17,"photoshopjs-core":2}],15:[function(require,module,exports){
var divide, _;

_ = require('photoshopjs-core');

module.exports = divide = function(orientation, divisions) {
  var add, b, bounds, d, doc, domDoc, horizontal, i, vertical, _i, _len;
  if (orientation !== 'vertical' && orientation !== 'horizontal' && orientation !== 'both') {
    throw Error("orientation '" + orientation + "' isn't in ['vertical', 'horizontal', 'both']");
  }
  if (!(typeof divisions === 'string' || typeof divisions === 'number')) {
    throw Error("divisions must be a string");
  }
  divisions = String(divisions).replace(/^\s+/, '').replace(/\s+$/, '');
  if (!divisions.match(/^[0-9]+$/)) {
    throw Error("Divisions must be a number. Given: '" + divisions + "'");
  }
  d = parseInt(divisions);
  if (d === 0) {
    throw Error("Wrong value for divisions: '" + divisions + "'");
  }
  divisions = d;
  doc = _.docs.active;
  try {
    domDoc = doc.asDom();
  } catch (_error) {
    throw Error("No document seems to be open");
  }
  try {
    bounds = domDoc.selection.bounds;
  } catch (_error) {
    bounds = [0, 0, domDoc.width, domDoc.height];
  }
  for (i = _i = 0, _len = bounds.length; _i < _len; i = ++_i) {
    b = bounds[i];
    if (b instanceof UnitValue) {
      bounds[i] = b.value;
    }
  }
  vertical = function() {
    var from, method, to;
    from = bounds[0];
    to = bounds[2];
    method = 'addVertical';
    return add(from, to, method);
  };
  horizontal = function() {
    var from, method, to;
    from = bounds[1];
    to = bounds[3];
    method = 'addHorizontal';
    return add(from, to, method);
  };
  add = function(from, to, method) {
    var cur, len, piece, _j;
    len = to - from;
    piece = len / (divisions + 1);
    cur = from;
    for (i = _j = 1; 1 <= divisions ? _j <= divisions : _j >= divisions; i = 1 <= divisions ? ++_j : --_j) {
      cur += piece;
      doc.guides[method](cur);
    }
  };
  if (orientation === 'vertical') {
    vertical();
  } else if (orientation === 'horizontal') {
    horizontal();
  } else {
    vertical();
    horizontal();
  }
};

_.panel('divide', function(args) {
  return divide(args.orientation, args.divisions);
});

},{"photoshopjs-core":2}],16:[function(require,module,exports){
var griddify, _;

_ = require('photoshopjs-core');

module.exports = griddify = function(direction, spacing) {
  var add, b, bounds, cur, doc, domDoc, guides, gutter, gutters, i, max, method, reached, start, _i, _j, _k, _len, _len1, _len2;
  if (direction !== 'right' && direction !== 'down' && direction !== 'left' && direction !== 'up') {
    throw Error("direction '" + direction + "' isn't in ['right', 'down', 'left', 'up']");
  }
  if (!(typeof spacing === 'string' || typeof spacing === 'number')) {
    throw Error("spacing must be a string");
  }
  spacing = String(spacing).replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/, ' ');
  if (!spacing.match(/[0-9]+/)) {
    throw Error("There are no numbers in spacing");
  }
  if (!spacing.match(/^[0-9\s\.]+$/)) {
    throw Error("Wrong value for spacing");
  }
  gutters = spacing.split(' ');
  for (i = _i = 0, _len = gutters.length; _i < _len; i = ++_i) {
    gutter = gutters[i];
    if (isNaN(gutter)) {
      throw Error("gutter '" + gutter + "' is not a number");
    }
    gutter = parseFloat(gutter);
    if (gutter <= 0) {
      throw Error("Gutters must be bigger than zero");
    }
    gutters[i] = gutter;
  }
  doc = _.docs.active;
  try {
    domDoc = doc.asDom();
  } catch (_error) {
    throw Error("No document seems to be open");
  }
  try {
    bounds = domDoc.selection.bounds;
  } catch (_error) {
    bounds = [0, 0, domDoc.width, domDoc.height];
  }
  for (i = _j = 0, _len1 = bounds.length; _j < _len1; i = ++_j) {
    b = bounds[i];
    if (b instanceof UnitValue) {
      bounds[i] = b.value;
    }
  }
  if (direction === 'right') {
    start = bounds[0];
    max = bounds[2];
    method = 'addVertical';
    add = true;
  } else if (direction === 'left') {
    start = bounds[2];
    max = bounds[0];
    method = 'addVertical';
    add = false;
  } else if (direction === 'down') {
    start = bounds[1];
    max = bounds[3];
    method = 'addHorizontal';
    add = true;
  } else {
    start = bounds[3];
    max = bounds[1];
    method = 'addHorizontal';
    add = false;
  }
  guides = doc.guides;
  cur = start;
  reached = false;
  while (true) {
    for (_k = 0, _len2 = gutters.length; _k < _len2; _k++) {
      gutter = gutters[_k];
      if (add) {
        cur += gutter;
      } else {
        cur -= gutter;
      }
      if ((add && cur > max) || (!add && cur < max)) {
        reached = true;
        break;
      }
      guides[method](cur);
    }
    if (reached) {
      break;
    }
  }
};

_.panel('griddify', function(args) {
  return griddify(args.direction, args.spacing);
});

},{"photoshopjs-core":2}],17:[function(require,module,exports){
var wrap, _;

_ = require('photoshopjs-core');

module.exports = wrap = function(orientation, spacing) {
  var add, b, bounds, doc, domDoc, gutter, gutters, horizontal, i, vertical, _i, _j, _len, _len1;
  if (orientation !== 'vertical' && orientation !== 'horizontal' && orientation !== 'both') {
    throw Error("orientation '" + orientation + "' isn't in ['vertical', 'horizontal', 'both']");
  }
  if (!(typeof spacing === 'string' || typeof spacing === 'number')) {
    throw Error("spacing must be a string");
  }
  spacing = String(spacing).replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/, ' ');
  if (!spacing.match(/[0-9]+/)) {
    throw Error("There are no numbers in spacing");
  }
  if (!spacing.match(/^[\-0-9\s\.]+$/)) {
    throw Error("Wrong value for spacing");
  }
  gutters = spacing.split(' ');
  for (i = _i = 0, _len = gutters.length; _i < _len; i = ++_i) {
    gutter = gutters[i];
    if (isNaN(gutter)) {
      throw Error("gutter '" + gutter + "' is not a number");
    }
    gutter = parseFloat(gutter);
    gutters[i] = gutter;
  }
  doc = _.docs.active;
  try {
    domDoc = doc.asDom();
  } catch (_error) {
    throw Error("No document seems to be open");
  }
  try {
    bounds = domDoc.selection.bounds;
  } catch (_error) {
    bounds = [0, 0, domDoc.width, domDoc.height];
  }
  for (i = _j = 0, _len1 = bounds.length; _j < _len1; i = ++_j) {
    b = bounds[i];
    if (b instanceof UnitValue) {
      bounds[i] = b.value;
    }
  }
  vertical = function() {
    add(bounds[0], true, 'addVertical');
    return add(bounds[2], false, 'addVertical');
  };
  horizontal = function() {
    add(bounds[1], true, 'addHorizontal');
    return add(bounds[3], false, 'addHorizontal');
  };
  add = function(from, asc, method) {
    var cur, _k, _len2;
    cur = from;
    for (_k = 0, _len2 = gutters.length; _k < _len2; _k++) {
      gutter = gutters[_k];
      if (asc) {
        cur += gutter;
      } else {
        cur -= gutter;
      }
      doc.guides[method](cur);
    }
  };
  if (orientation === 'vertical') {
    vertical();
  } else if (orientation === 'horizontal') {
    horizontal();
  } else {
    vertical();
    horizontal();
  }
};

_.panel('wrap', function(args) {
  return wrap(args.orientation, args.spacing);
});

},{"photoshopjs-core":2}]},{},[14])