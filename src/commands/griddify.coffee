_ = require 'photoshopjs-core'

module.exports = griddify = (direction, spacing) ->
	unless direction in ['right', 'down', 'left', 'up']
		throw Error "direction '#{direction}' isn't in ['right', 'down', 'left', 'up']"

	unless typeof spacing is 'string' or typeof spacing is 'number'
		throw Error "spacing must be a string"

	spacing = String(spacing).replace /^\s+/, ''
	.replace /\s+$/, ''
	.replace /\s+/, ' '

	unless spacing.match /[0-9]+/
		throw Error "There are no numbers in spacing"

	unless spacing.match /^[0-9\s\.]+$/
		throw Error "Wrong value for spacing"

	gutters = spacing.split ' '
	for gutter, i in gutters
		if isNaN gutter
			throw Error "gutter '#{gutter}' is not a number"

		gutter = parseFloat gutter
		if gutter <= 0
			throw Error "Gutters must be bigger than zero"

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

	if direction is 'right'
		start = bounds[0]
		max = bounds[2]
		method = 'addVertical'
		add = yes
	else if direction is 'left'
		start = bounds[2]
		max = bounds[0]
		method = 'addVertical'
		add = no
	else if direction is 'down'
		start = bounds[1]
		max = bounds[3]
		method = 'addHorizontal'
		add = yes
	else
		start = bounds[3]
		max = bounds[1]
		method = 'addHorizontal'
		add = no

	guides = doc.guides
	cur = start
	reached = no
	loop
		for gutter in gutters
			if add
				cur += gutter
			else
				cur -= gutter

			if (add and cur > max) or (not add and cur < max)
				reached = yes
				break

			guides[method] cur

		break if reached

	return

_.panel 'griddify', (args) ->
	griddify args.direction, args.spacing