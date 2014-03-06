_ = require 'photoshopjs-core'

module.exports = divide = (orientation, divisions) ->

	unless orientation in ['vertical', 'horizontal', 'both']

		throw Error "orientation '#{orientation}' isn't in ['vertical', 'horizontal', 'both']"

	unless typeof divisions is 'string' or typeof divisions is 'number'

		throw Error "divisions must be a string"

	divisions = String(divisions).replace /^\s+/, ''
	.replace /\s+$/, ''

	unless divisions.match /^[0-9]+$/

		throw Error "Divisions must be a number. Given: '#{divisions}'"

	d = parseInt divisions

	unless d isnt 0

		throw Error "Wrong value for divisions: '#{divisions}'"

	divisions = d

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

		add from, to, method

	horizontal = ->

		from = bounds[1]
		to = bounds[3]
		method = 'addHorizontal'

		add from, to, method

	add = (from, to, method) ->

		len = to - from

		piece = len / (divisions + 1)

		cur = from

		for i in [1..divisions]

			cur += piece

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

_.panel 'divide', (args) ->

	divide args.orientation, args.divisions