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

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
