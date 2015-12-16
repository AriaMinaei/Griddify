module.exports = class ThemeHandler
	constructor: (@panel) ->
		@current = 'light1'
		@_changeTheme 'dark1', 'Tahoma', '10'

		if window.CC
			@panel.csi.addEventListener @panel.csi.constructor.THEME_COLOR_CHANGED_EVENT, @_themeChangeListenerCC
			do @_themeChangeListenerCC
		else
			window.addEventListener 'ThemeChangedEvent', @_themeChangeListenerCS

	_themeChangeListenerCC: =>
		skin = @panel.csi.hostEnvironment.appSkinInfo
		color = skin.panelBackgroundColor.color

		theme = if color.red > 200
			'light2'
		else if color.red > 120
			'light1'
		else if color.red > 75
			'dark2'
		else
			'dark1'

		@_changeTheme theme, skin.baseFontFamily, skin.baseFontSize

	_themeChangeListenerCS: (e) =>
		bgColor = e.appSkinInfo.panelBackgroundColor
		theme = switch bgColor
			when '343434' then 'dark1'
			when 'b8b8b8' then 'light1'
			when 'd6d6d6' then 'light2'
			else 'dark2'

		skin = e.appSkinInfo
		@_changeTheme theme, skin.baseFontFamily, skin.baseFontSize

	_changeTheme: (theme, fontFamily, fontSize) ->
		html = document.querySelector 'html'
		body = document.body
		body.style.fontFamily = fontFamily
		body.style.fontSize = fontSize + 'px'

		for t in ['light1', 'light2', 'dark1', 'dark2', 'light', 'dark']
			html.classList.remove t

		html.classList.add theme

		if theme in ['light1', 'light2']
			html.classList.add 'light'
		else
			html.classList.add 'dark'

		@current = theme

		size = if fontSize <= 10
			'small'
		else if fontSize < 12
			'medium'
		else
			'large'

		for s in ['small', 'medium', 'big']
			html.classList.remove "size-#{s}"

		html.classList.add "size-#{size}"

	isLight: ->
		@current in ['light1', 'light2']