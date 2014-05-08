Panel = require 'photoshopjs-panel'

panel = new Panel 'Griddify'

{name, version} = require '../../../package.json'

panel.updateNotifier.init

	name: name

	version: version

	hub: "http://localhost/open-source/photoshopjs/hub/"

	updateUrl: "http://gelobi.org/griddify"