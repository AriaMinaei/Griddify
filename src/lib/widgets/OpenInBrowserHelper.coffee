module.exports = class OpenInBrowserHelper
	@applyTo: (node, panel) ->
		new OpenInBrowserHelper node, panel

	constructor: (@node, @panel) ->
		@node.addEventListener 'click', (e) =>
			el = e.target
			if el.tagName is 'A' and el.classList.contains 'browse'
				e.preventDefault()
				@browse el.href, @panel

	browse: (url) ->
		# https://forums.adobe.com/thread/1311885

		# CSInterface.openURLInDefaultBrowser() isn't available on all versions,
		# so we have to do something like this:

		isWindows = window.navigator.platform.toLowerCase().indexOf("win") > -1
		rootDir = "/"
		if isWindows
			rootDir = @panel.csi.getSystemPath("commonFiles").substring(0, 3)

		processPath = "/usr/bin/open"

		if isWindows
			processPath = rootDir + "Windows/explorer.exe"

		window.cep.process.createProcess(processPath, url)