const { app, BrowserWindow, dialog } = require('electron');

var root = app.getAppPath();

function createWindow() {
	const win = new BrowserWindow({
		backgroundColor: '#0',
		show: false,
		frame: false,
		width: 1920,
		height: 1080,
		minHeight: 525,
		minWidth: 1455,
		icon: root + '/assets/images/icons/png/icon.png',
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile('assets/html/main.html');
	win.setMenuBarVisibility(false);
	win.on('ready-to-show', function() {
		win.show();
		win.focus();
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

//JS Stuff
const fs = require('fs');
const path = require('path');
const request = require('request');
var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(3000);

io.on('connection', (socket) => {

	socket.on('selectDir', () => {

		var options = {
			title: 'Open a folder',
			properties: [ 'openDirectory' ]
		};

    const folders = dialog.showOpenDialog(null, options).then(async (folders) => {
			var dir = folders.filePaths[0] + path.sep;
			if (dir == "undefined" + path.sep) return;
			console.log(dir)
			io.emit('getDirectory', dir);
		});
	});
});
