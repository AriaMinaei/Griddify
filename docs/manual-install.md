# Manual install on Photoshop CC 2014

Many people have been having problem installing Griddify on CC 2014. This is an alternative way to install Griddify on CC 2014 without using Adobe Extension Manager.

## Enabling manual installation

There is this thing in CC apps called the "debug mode" that you need to enable before manually installing any extension.

### On Windows:

1. Choose **Run** from the Windows Start menu, and enter `regedit` to open the registry editor.
2. Navigate to the key `HKEY_CURRENT_USER\Software\Adobe\CSXS.5`
3. Choose Edit > New > String Value. Enter the Name key `PlayerDebugMode`, and set Data to `1` to enable debug mode.
4. Close the registry editor

### On OSX:

1. Navigate to the folder `<user>/Library/Preferences`
2. Find the property list (PLIST) file: `com.adobe.CSXS.5.plist`
3. Open this file with the XCode Property List editor, or the PlistBuddy command-line tool
4. Change value for the key `PlayerDebugMode` to `1` to enable debug mode as described below, and save the file.

**Notes:**

* If this file is read-only, you must add write permission for the user before you can update it. To do this, right click on the file and select `Get Info > Sharing & Permissions`.

* In OS X 10.9 Apple introduced a caching mechanism for property list files. This means that property modifications do not take effect immediately. To force you modification to take effect, open the Terminal application and enter this command: `sudo killall cfprefsd`

**Editing the file in XCode**

Open Xcode (Normally found in the Applications folder) and choose `File > Open`. Locate the property list
and click **Open**. If the `PlayerDebugMode` key already exists make sure its value is set to `1`. If not:

1. Hover over any entry and click Add (+).
2. Enter `PlayeDebugMode` as the key name.
3. Set the key type to “String”.
4. Enter `1` as the value.

When the key has the correct value, save the file.

**Editing the file in PlistBuddy**

Open the Terminal application (normally stored in the `/Applications/Utilities` folder), and enter this command to print the content of the property list file and check if the `PlayerDebugMode` key already exists:

```/usr/libexec/PlistBuddy -c “print” ~/Library/Preferences/com.adobe.CSXS.5.plist```

The output should look like this:

```
Dict {
   LogLevel = 1
}
```

* If the key already exists, use this command to set the flag: `/usr/libexec/PlistBuddy -c "set PlayerDebugMode 1" ~/Library/Preferences/com.adobe.CSXS.5.plist`
* If not, use this command to create and set the flag: `/usr/libexec/PlistBuddy -c "add PlayerDebugMode String 1" ~/Library/Preferences/com.adobe.CSXS.5.plist`
* To confirm that the entry has been added successfully, print the content of the property list file again. It should now have the new key:
	```
	Dict {
		PlayerDebugMode = 1
		LogLevel = 1
	}
	```

## Manually installing Griddify

**Locate the extensions folder:**

* In Windows 64: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
* In Windows 32: `C:\Program Files\Common Files\Adobe\CEP\extensions\`
* In OSX: `/Library/Application Support/Adobe/CEP/extensions/`

**Download Griddify**

You can downloaded the manual install version from [here](https://github.com/pixana/griddify/releases/download/1.0.0-beta.4/griddify-1.0.0-beta.4-manual-install.zip).

**Install**

Extract the zip file and put the `griddify` folder inside the `extensions` folder you located above.

If all has gone well, you should be able to start Photoshop and see Griddify in Window > Extensions menu.