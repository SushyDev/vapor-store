var file = app.getPath('userData') + '/Json/store.json';
var games = JSON.parse(fs.readFileSync(file, 'utf8'));

sessionStorage.setItem("Searching", false)

var gameCount;



function listGames() {
	gameCount = 0;
	document.getElementById('game-count').innerHTML = 'Games: ' + gameCount;
	document.getElementById('game-store-list').innerHTML = '';
		asyncForEach(games.list, async (game) => {
			if (sessionStorage.getItem("Searching") == "true") {
				return;
			} else {
			var gameName = game.name;
			var gameCover = game.cover;
			var gameID = game.id;
			var gameLink = game.link;

			gameCount++;

			document.getElementById('game-count').innerHTML = 'Games: ' + gameCount;

			var dataArray = { name: game.name, cover: gameCover, id: game.id, link: game.link };
			var data = JSON.stringify(dataArray);

			var rand = Math.floor(Math.random() * 1000000000);

			var Game = document.createElement('div');
			Game.className = 'game-div';
			Game.id = rand;
			Game.setAttribute('onclick', 'openGame(' + "'" + data + "'" + ')');
			document.getElementById('game-store-list').appendChild(Game);

			var Cover = document.createElement('img');
			Cover.src = gameCover;
			Cover.className = 'game-cover';
			document.getElementById(rand).appendChild(Cover);

			var Title = document.createElement('p');
			Title.innerHTML = gameName;
			Title.className = 'game-name';
			document.getElementById(rand).appendChild(Title);
			await waitFor(0);
			}
		});
	}

	listGames()

	async function openGame(data) {
		var data = JSON.parse(data);

		sessionStorage.setItem('selectedGameName', data.name);
		sessionStorage.setItem('selectedGameCover', data.cover);
		sessionStorage.setItem('selectedGameID', data.id);
		sessionStorage.setItem('selectedGameLink', data.link);
		sessionStorage.setItem('subPage', 'store-game');

		jQuery(function($) {
			$('#side-pane').load('store-game.html');
		});
	}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

var searchBox = document.getElementById('game-search');

searchBox.addEventListener('input', function() {
	search = searchBox.value;
	if (search == '') {
		sessionStorage.setItem("Searching", false)
		listGames()
	} else {
		sessionStorage.setItem("Searching", true)
		searchGames(search)
	}
});

function searchGames() {
	gameCount = 0;
	document.getElementById('game-count').innerHTML = 'Games: ' + gameCount;
	document.getElementById('game-store-list').innerHTML = '';
		asyncForEach(games.list, async (game) => {
			if (sessionStorage.getItem("Searching") == "false") {
				return;
			} else if (game.name.includes(search)){
			var gameName = game.name;
			var gameCover = game.cover;
			var gameID = game.id;
			var gameLink = game.link;

			gameCount++;

			document.getElementById('game-count').innerHTML = 'Games: ' + gameCount;

			var dataArray = { name: game.name, cover: gameCover, id: game.id, link: game.link };
			var data = JSON.stringify(dataArray);

			var rand = Math.floor(Math.random() * 1000000000);

			var Game = document.createElement('div');
			Game.className = 'game-div';
			Game.id = rand;
			Game.setAttribute('onclick', 'openGame(' + "'" + data + "'" + ')');
			document.getElementById('game-store-list').appendChild(Game);

			var Cover = document.createElement('img');
			Cover.src = gameCover;
			Cover.className = 'game-cover';
			document.getElementById(rand).appendChild(Cover);

			var Title = document.createElement('p');
			Title.innerHTML = gameName;
			Title.className = 'game-name';
			document.getElementById(rand).appendChild(Title);
			await waitFor(0);
			}
		});
	}