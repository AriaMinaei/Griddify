Panel = require 'photoshopjs-panel'

panel = new Panel 'Griddify'

{name, version} = require '../../../package.json'

panel.updateNotifier.init

	name: name

	version: version

	hub: "http://gelobi.org/griddify/updateHub/"

	updateUrl: "http://gelobi.org/griddify"

# This seems to completely mess up with the plugin's cache,
# so I'm just gonna leave it off for now
# panel.setPersistency on, "Griddify"