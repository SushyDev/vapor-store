var file = app.getPath('userData') +'/Json/library.json';

try {
	var games = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
	var list = {
		list: []
	};

	fs.writeFile(app.getPath('userData') +'/Json/library.json', JSON.stringify(list), 'utf-8', function(err) {
		if (err) throw err;
	});
}

games.list.forEach((game) => {
	try {
		var gameName = game.name;
		var gameCover = game.cover;
		var gameID = game.id;
		var gameLink = game.link;
		var gameFolder = game.folder;

		var dataArray = { name: game.name, cover: game.cover, id: game.id, link: game.link, folder: game.folder };
		var data = JSON.stringify(dataArray);

		var rand = Math.floor(Math.random() * 1000000000);

		var Game = document.createElement('div');
		Game.className = 'game-div';
		Game.id = rand;
		Game.setAttribute('onclick', 'openGame(' + "'" + data + "'" + ')');
		document.getElementById('game-library-list').appendChild(Game);

		var Cover = document.createElement('img');
		Cover.src = gameCover;
		Cover.className = 'game-cover';
		document.getElementById(rand).appendChild(Cover);

		var Title = document.createElement('p');
		Title.innerHTML = gameName;
		Title.className = 'game-name';
		document.getElementById(rand).appendChild(Title);
	} catch (e) {
		console.log(e);
	}
});

async function openGame(data) {
	var data = JSON.parse(data);

	sessionStorage.setItem('selectedGameName', data.name);
	sessionStorage.setItem('selectedGameCover', data.cover);
	sessionStorage.setItem('selectedGameID', data.id);
	sessionStorage.setItem('selectedGameLink', data.link);
	sessionStorage.setItem('selectedGameFolder', data.folder);
	sessionStorage.setItem('subPage', 'library-game');

	jQuery(function($) {
		$('#side-pane').load('library-game.html');
	});
}
