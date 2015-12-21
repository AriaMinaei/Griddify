Panel = require '../lib/Panel'
{name, version} = require '../../package.json'
require '../../styles/griddify.styl'

panel = new Panel 'Griddify'

panel.updateNotifier.init
  name: name
  version: version
  channel: "beta"
  hub: "http://gelobi.org/griddify/updateHub2/"
  updateUrl: "http://gelobi.org/griddify"

panel.setPersistency on, "Griddify"