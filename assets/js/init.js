//If no background url is set then set default one
if (localStorage.getItem('backgroundUrl') == undefined) {
	localStorage.setItem(
		'backgroundUrl',
		'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FVapor%20Store%20Wallpaper.png?v=1590248243315'
	);
}

//If no download dir is set then set default one
if (localStorage.getItem('downloadDirectory') == undefined) {
	var dir = app.getPath('userData') + path.sep + 'Games' + path.sep;
	var dir = dir.replace(/[\\]/g, '/');
	localStorage.setItem('downloadDirectory', dir);
}

var dir = app.getPath('userData') + '/Json';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

//Load background image
var url = localStorage.getItem('backgroundUrl');
document.getElementById('background').style.backgroundImage = 'url(' + url + ')';

sessionStorage.setItem('Downloading', 'false');