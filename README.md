# Griddify

It's a tiny photoshop panel to make guides and grids. See the tutorial [here](http://gelobi.org/griddify).

![Preview of Griddify](https://github.com/AriaMinaei/griddify/raw/master/docs/images/preview.png)

## Manual Install

If you're having trouble installing Griddify on Photoshop CC, there is a manual installation guide [here](./docs/manual-install.md).

## Development

First, there is this thing in CC apps called the "debug mode" that you need to enable in order to develop extensions:

- In Windows:
	1. Choose **Run** from the Windows Start menu, and enter `regedit` to open the registry editor.
	2. Find this key:
	  - For CC 2014: `HKEY_CURRENT_USER\Software\Adobe\CSXS.5`
	  - For CC 2015: `HKEY_CURRENT_USER\Software\Adobe\CSXS.6`
	3. Choose Edit > New > String Value. Enter `PlayerDebugMode` as the Name, and set Data to `1`.
	4. Close the registry editor.
- In OSX:
	1. Find this folder `~/Library/Preferences`
	2. Find this file:
	  - For CC 2014: `com.adobe.CSXS.5.plist`
	  - For CC 2015: `com.adobe.CSXS.6.plist`
	3. Open the file using an application that can edit Plist files. You can use the XCode Property List editor, or the PlistBuddy command-line tool.
	4. Change the value of the key `PlayerDebugMode` to `1` to enable debug mode save the file.
		- If this file is read-only, you must add write permission for the user before you can update it. To do this, right click on the file and select `Get Info > Sharing & Permissions`.
		- In OSX 10.9 Apple introduced a caching mechanism for property list files. This means that property modifications do not take effect immediately. To force you modification to take effect, open the Terminal application and enter this command: `$ sudo killall cfprefsd`

Now that you've enabled "debug mode," you can install Griddify by manually copying it to the place where Adobe extensions are stored:

1. Find the extensions folder:
	- In Windows:
		- In Windows 64: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
		- In Windows 32: `C:\Program Files\Common Files\Adobe\CEP\extensions\`
		- In older versions of CC, this folder will be in `C:\Users\AppData\Roaming\Adobe\CEP\extensions\`
	- In OSX: `/Library/Application Support/Adobe/CEP/extensions/`
	- **Note**:  The `CEP` folder might be called `CEPServiceManager4` or something similar in older CC versions.
	- **Noted 2**: If you can find the `CEP` folder, but there is no `extensions` folder inside it, just create it yourself.
2. Clone the repo and install its dependencies with npm:

	```
	$ git clone git@github.com:AriaMinaei/Griddify.git
	$ cd griddify
	$ npm install
	```
3. Create a symlink from where you cloned the repo to the extensions folder you located above. In the end, you should be able to see a file named `panel.html` when you navigate to `... CEP/extensions/Griddify`.
4. Restart Photoshop CC. If all has gone well, you will be able to find the panel in "Window -> Extensions -> Griddify".

#### Watching for cahanges

To watch the files for changes, run:
```
$ npm run dev
```

The entry file for ExtendScript commands is `src/commands.coffee`, and the entry file for the interface is  `src/panel/panel.coffee`.

## License

It's under GPL Version 3.