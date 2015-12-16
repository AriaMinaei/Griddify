module.exports = class Form
	constructor: (@panel, @node) ->
		@csi = @panel.csi

		@node.addEventListener 'submit', (e) =>
			e.preventDefault()
			do @_submit

	_submit: ->
		data = {}
		for input in @node.querySelectorAll 'input'
			data[input.name] = input.value

		@_wire data

	_wire: (data) ->
		action = @node.action
		unless matches = action.match /\#([a-zA-Z0-9\_]+)$/
			throw Error "Couldn't parse action address '#{action}'"

		method = matches[1]
		@panel.invoke method, data

	@applyTo: (rootNode, panel) ->
		for form in rootNode.querySelectorAll 'form'
			if String(form.getAttribute('action')).match /^#/
				new Form panel, form

		return