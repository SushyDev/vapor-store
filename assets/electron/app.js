const { app, BrowserWindow } = require('electron');

var root = app.getAppPath();

function createWindow() {
	const win = new BrowserWindow({
		show: false,
		frame: false,
		width: 1920,
		height: 1080,
		minHeight: 450,
		minWidth: 575,
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

var server = require('http').createServer();

server.listen();
