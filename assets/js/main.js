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
<<<<<<< HEAD

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
=======
>>>>>>> 47cc091b611512d50c156a1a175e5a23d32503c8
