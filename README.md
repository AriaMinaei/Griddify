# Griddify

It's a tiny photoshop panel to make guides and grids. Download and see the tutorial [here](http://gelobi.org/griddify).

![Preview of Griddify](https://github.com/pixana/griddify/raw/master/docs/images/preview.png)

## Bugs and Feature Requests

Firstly, thank you for wanting to contribute! If you have any features/improvements in mind, or if something isn't working, just open an [issue](./issues).

## Development

PRs are more than welcome! Griddify depends on [photoshopjs-core](https://github.com/pixana/photoshopjs-core) to command photoshop and also on [photoshopjs-panel](https://github.com/pixana/photoshopjs-panel) to create the interface of the panel. These projects currently only support the requirements of Griddify, and they'll be further developed as we work on Griddify and a couple of other Photoshop panels, which means if you wanna add a feature to Griddify, you probably gonna have to take a look at those too.

Here, I'll describe how you can develop griddify:

##### First, the requirements:

Beside Photoshop CC, you need to have [ruby](https://www.ruby-lang.org)/[compass](http://compass-style.org) if you want to change the css, and you need nodejs if you wanna change the scripts.

##### Preparing the dev environment:

Get a clone of the repo and then install with npm:
```
$ git clone https://github.com/pixana/griddify
$ cd griddify
$ npm install
```

Then, create a symlink from this directory to where you installed griddify:
* On Mac: ~/Library/Application Support/Adobe/CEPServiceManager4/extensions
* On Windows: %APPDATA%\Adobe\CEPServiceManager4\extensions (You might have to create the extensions folder)

You also need to enable the debug mode in Adobe applications. Quoting from this [article](http://www.adobe.com/devnet/creativesuite/articles/a-short-guide-to-HTML5-extensions.html):

> * On Mac, open the file ~/Library/Preferences/com.adobe.CSXS.4.plist and add a row with key PlayerDebugMode, of type String, and value 1.
> * On Windows, open the registry key HKEY_CURRENT_USER/Software/Adobe/CSXS.4 and add a key named PlayerDebugMode, of type String, and value 1.

Now, if everything has worked, when you restart Photoshop CC you should be able to see the panel in the window menu, uner extensions.

#### Developing

To watch the files for changes:
```
In OSX: (Could someone please test this?)
$ npm run watch

In windows:
$ npm run winwatch
```

The extendscript stuff are in the `scripts/coffee/commands` directory.

## License

It's under GPL Version 3.