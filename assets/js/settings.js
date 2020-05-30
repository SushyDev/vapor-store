//Set Background Feature

function setBackground() {
	var url = document.getElementById('background-url').value;
	localStorage.setItem('backgroundUrl', url);

	var url = localStorage.getItem('background-url');
	document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
	document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');
}

function clearBackground() {
	localStorage.setItem(
		'backgroundUrl',
		'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FVapor%20Store%20Wallpaper.png?v=1590248243315'
	);
	document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
}

function getDirectory() {
	socket.emit('selectDir');
}

socket.on('getDirectory', (dir) => {
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
	document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');
});

function clearDirectory() {
	var dir = app.getPath('userData') + path.sep + 'Games' + path.sep;
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
	document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');
}

function igdbLogin() {
	var token = document.getElementById('igdb-token');
	localStorage.setItem('IGDBToken', token.value);
	document.getElementById('igdb-details').style.display = 'block';
	document.getElementById('igdb-details').value = 'Using this token';
}

//Set settings

//Set current wallpaper url lable
document.getElementById('background-url').value = localStorage.getItem('backgroundUrl');

//Set download location lable
document.getElementById('current-download-directory').value = localStorage.getItem('downloadDirectory');

//Set IGDB token lable
document.getElementById('igdb-token').value = localStorage.getItem('IGDBToken');

//Set version lable
document.getElementById('current-version').value = app.getVersion();
