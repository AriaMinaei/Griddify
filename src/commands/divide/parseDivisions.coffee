module.exports = (str) ->
	conf =
		divisions: 0
		hasGutters: no
		gutters: []

	unless typeof str is 'string' or typeof str is 'number'
		throw Error "divisions must be a string"

	str = String(str).replace /^\s+/, ''
	.replace /\s+$/, ''

	nums = str.split /\s+/
	if nums.length is 0
		throw Error "Divisions must contain numbers"

	divisions = nums.shift()
	unless divisions.match /^[0-9]+$/
		throw Error "Divisions must be a number. Given: '#{divisions}'"

	divisions = parseInt divisions
	if divisions is 0
		throw Error "Divisions cannot be zero"

	conf.divisions = divisions

	for gutter, i in nums
		conf.hasGutters = yes
		if isNaN gutter
			throw Error "gutter '#{gutter}' is not a number"

		gutter = parseFloat gutter
		if gutter <= 0
			throw Error "Gutters must be bigger than zero"

		conf.gutters.push gutter

	conf