
exec = require('child_process').exec
fs = require 'fs'
sysPath = require 'path'
jitter = require 'jitter'
browserify = require 'browserify'

task 'compile:coffee', ->

	unless fs.existsSync './scripts/js'

		fs.mkdirSync './scripts/js'

	unless fs.existsSync './scripts/dist'

		fs.mkdirSync './scripts/dist'

	exec 'node ./node_modules/coffee-script/bin/coffee -bco ./scripts/js ./scripts/coffee',

		(error) ->

			if fs.existsSync '-p'

				fs.rmdirSync '-p'

			invoke 'browserify'

			if error?

				console.log 'Compile failed: ' + error

			return

task 'build', ->

	invoke 'compile:coffee'

task 'browserify', ->

	b = browserify()
	b.add './scripts/js/panel/panel.js'

	b.bundle {detectGlobals: no, debug: no}, (err, content) ->

		fs.writeFileSync './scripts/dist/panel.js', content, {encoding: 'utf-8'}

	b = browserify()
	b.add './scripts/js/commands/commands.js'

	b.bundle {detectGlobals: no, debug: no}, (err, content) ->

		fs.writeFileSync './scripts/dist/commands.jsx', content, {encoding: 'utf-8'}

# This is in place until we replace the test suite runner with popo
task 'test', ->

	runTestsIn 'scripts/coffee/test', '_prepare.coffee'

runInCoffee = (path, cb) ->

	exec 'node ./node_modules/coffee-script/bin/coffee ' + path, cb

runTestsIn = (shortPath, except) ->

	fullPath = sysPath.resolve shortPath

	fs.readdir fullPath, (err, files) ->

		if err then throw Error err

		for file in files

			return if file is except

			fullFilePath = sysPath.resolve(fullPath, file)
			shortFilePath = shortPath + '/' + file

			if sysPath.extname(file) is '.coffee'

				runAsTest shortFilePath, fullFilePath

			else if fs.statSync(fullFilePath).isDirectory()

				runTestsIn shortFilePath

		return

didBeep = no

runAsTest = (shortPath, fullPath) ->

	runInCoffee fullPath, (error, stdout, stderr) ->

		output = 'Running ' + shortPath + '\n'

		if stderr

			unless didBeep

				`console.log("\007")`

				didBeep = yes

			output += 'Error\n' + stdout + stderr + '\n'

		else if stdout

			output += '\n' + stdout

		console.log output

task 'watch', ->

