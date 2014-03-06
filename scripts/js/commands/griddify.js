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
