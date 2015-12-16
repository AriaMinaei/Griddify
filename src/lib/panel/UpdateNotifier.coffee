semver = require 'semver/semver.js'

module.exports = class UpdateNotifier
	constructor: (@panel) ->

	init: (options) ->
		@name = options.name
		@version = options.version
		@hub = options.hub
		@channel = options.channel
		@updateUrl = options.updateUrl

		@request = new XMLHttpRequest

		@request.onreadystatechange = =>
			if @request.readyState is 4
				@_processResult @request.responseText

		@request.open 'GET', @hub, yes
		@request.send null

	_processResult: (response) ->
		json = JSON.parse response
		return unless json.channels? and json.channels[@channel]?

		latestVersionOnChannel = json.channels[@channel]

		# If there is a new version available
		if semver.gt latestVersionOnChannel, @version
				do @_considerShowingUpdateNotification

	_considerShowingUpdateNotification: ->
		do @_showUpdateNotification

	_showUpdateNotification: ->
		@node = document.createElement 'div'
		@node.className = "serverNotification visible"
		document.body.appendChild @node

		@linkNode = document.createElement 'a'
		@linkNode.className = "serverNotification-msg browse"
		@linkNode.href = @updateUrl
		@linkNode.innerHTML = 'New Version Available at ' + @updateUrl.replace('http://', '')
		@node.appendChild @linkNode

		@closeNode = document.createElement 'button'
		@closeNode.className = "serverNotification-discard"
		@closeNode.innerHTML = "Remind Me Later"
		@node.appendChild @closeNode

		@linkNode.addEventListener 'click', @_close
		@closeNode.addEventListener 'click', @_close

	_close: =>
		@node.classList.remove 'visible'