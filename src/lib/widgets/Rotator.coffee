module.exports = class Rotator

	constructor: (@node) ->

		@name = @node.getAttribute('data-name')

		options = @node.getAttribute 'data-options'

		unless options? and options.trim() isnt ''

			throw Error "Rotator isn't supplied with data-options"

		@options = []

		for o in options.split(/\s*,\s*/)

			@options.push o

		@node.classList.add 'panel-input-rotator'

		for i in [0..6]

			thingy = document.createElement 'div'
			thingy.classList.add 'thingy'
			thingy.classList.add 'n' + i

			@node.appendChild thingy

		@input = document.createElement 'input'
		@input.type = 'hidden'
		@input.name = @name

		@node.parentNode.appendChild @input

		@set @node.getAttribute('data-default') or @options[0]

		@node.addEventListener 'click', @rotate

	set: (to) ->

		unless to in @options

			throw Error "Option '#{to}' isn't defined."

		if @current? then @node.classList.remove @current

		@node.classList.add to

		@current = to

		@input.value = to

		@

	rotate: =>

		newIndex = @options.indexOf(@current) + 1

		newIndex = newIndex % @options.length

		@set @options[newIndex]

		@

	@applyTo: (root) ->

		nodes = root.querySelectorAll '[data-type="rotator"]'

		for node in nodes

			new Rotator node

		return