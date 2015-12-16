parseDivisions = require './divide/parseDivisions'
_ = require 'photoshopjs-core'

module.exports = divide = (orientation, divisions) ->
	unless orientation in ['vertical', 'horizontal', 'both']
		throw Error "orientation '#{orientation}' isn't in ['vertical', 'horizontal', 'both']"

	{divisions, gutters} = parseDivisions divisions
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
		from = bounds[0]
		to = bounds[2]
		method = 'addVertical'

		addSeries from, to, method

	horizontal = ->
		from = bounds[1]
		to = bounds[3]
		method = 'addHorizontal'

		addSeries from, to, method

	addSeries = (from, to, method) ->
		len = to - from
		piece = len / (divisions)
		cur = from

		for i in [1...divisions]
			cur += piece
			addSingle cur, method

		return

	addSingle = (at, method) ->
		for p in positions
			doc.guides[method] p + at

		return

	positions = []

	do ->
		if gutters.length is 0
			positions.push 0
			return

		absolutes = [0]
		cur = 0

		for g in gutters
			cur += g
			absolutes.push cur

		len = cur
		for p in absolutes
			positions.push p - (len / 2)

		return

	if orientation is 'vertical'
		do vertical
	else if orientation is 'horizontal'
		do horizontal
	else
		do vertical
		do horizontal

	return

_.panel 'divide', (args) ->
	divide args.orientation, args.divisions