_ = require 'photoshopjs-core'

module.exports = wrap = (orientation, spacing) ->
	unless orientation in ['vertical', 'horizontal', 'both']
		throw Error "orientation '#{orientation}' isn't in ['vertical', 'horizontal', 'both']"

	unless typeof spacing is 'string' or typeof spacing is 'number'
		throw Error "spacing must be a string"

	spacing = String(spacing).replace /^\s+/, ''
	.replace /\s+$/, ''
	.replace /\s+/, ' '

	unless spacing.match /[0-9]+/
		throw Error "There are no numbers in spacing"

	unless spacing.match /^[\-0-9\s\.]+$/
		throw Error "Wrong value for spacing"

	gutters = spacing.split ' '
	for gutter, i in gutters
		if isNaN gutter
			throw Error "gutter '#{gutter}' is not a number"

		gutter = parseFloat gutter
		gutters[i] = gutter

	doc = _.docs.active

	try
		domDoc = doc.asDom()
	catch
		throw Error "No document seems to be open"

	try
		bounds = domDoc.selection.bounds
	catch
		bounds = [0, 0, domDoc.width, domDoc.height]

	for b, i in bounds
		if b instanceof UnitValue
			bounds[i] = b.value

	vertical = ->
		add bounds[0], yes, 'addVertical'
		add bounds[2], no, 'addVertical'

	horizontal = ->
		add bounds[1], yes, 'addHorizontal'
		add bounds[3], no, 'addHorizontal'

	add = (from, asc, method) ->
		cur = from
		for gutter in gutters
			if asc
				cur += gutter
			else
				cur -= gutter
			doc.guides[method] cur

		return

	if orientation is 'vertical'
		do vertical
	else if orientation is 'horizontal'
		do horizontal
	else
		do vertical
		do horizontal

	return

_.panel 'wrap', (args) ->
	wrap args.orientation, args.spacing