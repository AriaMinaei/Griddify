var Panel, name, panel, version, _ref;

Panel = require('photoshopjs-panel');

panel = new Panel('Griddify');

_ref = require('../../../package.json'), name = _ref.name, version = _ref.version;

panel.updateNotifier.init({
  name: name,
  version: version,
  hub: "http://gelobi.org/griddify/updateHub/",
  updateUrl: "http://gelobi.org/griddify"
});

panel.setPersistency(true, "com.pixana.griddify");
