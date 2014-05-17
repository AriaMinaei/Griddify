Panel = require 'photoshopjs-panel'

panel = new Panel 'Griddify'

{name, version} = require '../../../package.json'

panel.updateNotifier.init

	name: name

	version: version

	hub: "http://gelobi.org/griddify/updateHub/"

	updateUrl: "http://gelobi.org/griddify"

panel.setPersistency on, "Griddify"