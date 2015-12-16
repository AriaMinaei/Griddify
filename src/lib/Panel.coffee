window.CC = window.__adobe_cep__?
require './polyfills'

OpenInBrowserHelper = require './widgets/OpenInBrowserHelper'
UpdateNotifier = require './panel/UpdateNotifier'
ThemeHandler = require './ThemeHandler'
CSInterface = require './CSInterface' if window.CC
Rotator = require './widgets/Rotator'
Form = require './widgets/Form'

module.exports = class Panel
	constructor: (@panelName, @rootNode = document.body, @options) ->
		if window.CC
			@csi = new CSInterface

		@themeHandler = new ThemeHandler @
		Rotator.applyTo @rootNode, @
		Form.applyTo @rootNode, @
		OpenInBrowserHelper.applyTo @rootNode, @
		@updateNotifier = new UpdateNotifier @

	setPersistency: (isOn, id) ->
		return unless window.CC

		if isOn
			event = new CSInterface.CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION")
		else
			event = new CSInterface.CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION")

		event.extensionId = id
		@csi.dispatchEvent(event)

	invoke: (method, data, stringify = yes) ->
		data = JSON.stringify data if stringify

		try
			if window.CC
				src = "$.global._panels." + method + "(#{data});"
				@csi.evalScript src, (ret) ->
					console.log arguments
			else
				file = @options.jsx
				obj = '_panels'
				args = [data]
				_AdobeInvokeFunctionInScriptFile file, obj, method, args

		catch e
			console.error e

		return