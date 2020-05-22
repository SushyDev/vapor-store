//Menu buttons

function minWindow() {
	remote.getCurrentWindow().minimize();
}

function maxWindow() {
	remote.getCurrentWindow().isMaximized()
		? remote.getCurrentWindow().unmaximize()
		: remote.getCurrentWindow().maximize();
}

function closeWindow() {
	app.quit();
}
