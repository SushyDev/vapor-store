function Start(data) {
	document.getElementById('game-exe-list').style.display = 'none';
	document.getElementById('game-remove').style.display = 'none';
	var data = JSON.parse(data);

	name = data.name;
	cover = data.cover;
	id = data.id;
	url = data.link;
	folder = data.folder;

	const gameFolder = localStorage.getItem('downloadDirectory') + '/' + folder;

	function getDirectories(path) {
		return fs.readdirSync(path).filter(function(file) {
			return fs.statSync(path + '/' + file).isDirectory();
		});
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

	getDirectories(gameFolder).forEach((folderName) => {
		if (similarity(folderName, folder.replace(/[.]/g, ' ')) > 0.5) {
			const subFolder = localStorage.getItem('downloadDirectory') + folder + '/' + folderName;
			const fs = require('fs');

			fs.readdirSync(subFolder).forEach((file) => {
				if (file.substr(file.length - 3) == 'exe') {
					var executable = subFolder + '/' + file;

					var startButton = document.createElement('p');
					startButton.innerHTML = file.replace('.exe', '');
					startButton.className = 'game-exe-list';
					startButton.setAttribute('onclick', 'startGame(' + "'" + executable + "'" + ')');

					document.getElementById('game-cover-download').appendChild(startButton);
				}
			});
		}
	});
}

function startGame(executable) {
	var exec = require('child_process').execFile;
	exec(executable, function(err, data) {
		console.log(err);
		console.log(data.toString());
	});
}

function deleteGame() {
	var name = sessionStorage.getItem('selectedGameName');
	var cover = sessionStorage.getItem('selectedGameCover');
	var id = sessionStorage.getItem('selectedGameID');
	var url = sessionStorage.getItem('selectedGameLink');
	var folder = sessionStorage.getItem('selectedGameFolder');

	console.log(name, cover, id, url, folder);

	const subFolder = localStorage.getItem('downloadDirectory') + folder;

	console.log('Subfolder: ' + subFolder);

	rimraf(subFolder, function() {
		fs.readFile(app.getPath('userData') + '/Json/library.json', 'utf-8', function(err, data) {
			if (err) throw err;

			var games = JSON.parse(data);

			games.list.forEach((game, i) => {
				if (game.folder == folder) {

					delete games.list[i];

					var removedList = JSON.stringify(games).replace("null,", "")

					var parsedRemovedList = JSON.parse(removedList)

					console.log(parsedRemovedList.list[0])

					if(parsedRemovedList.list[0] == null) {

						var list = {
							list: []
						};
				
						fs.writeFile(app.getPath('userData') +'/Json/library.json', JSON.stringify(list), 'utf-8', function(err) {
							if (err) throw err;
						});

					} else {

						fs.writeFile(
							app.getPath('userData') + '/Json/library.json',
							removedList,
							'utf-8',
							function(err) {
								if (err) throw err;
							}
						);

					}
				}
			});
		});
	});
}
