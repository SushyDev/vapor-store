function addGameToLibrary(folderName) {
	
	var name = sessionStorage.getItem('downloadName');
	var cover = sessionStorage.getItem('downloadCover');
	var id = sessionStorage.getItem('downloadID');
	var url = sessionStorage.getItem('downloadUrl');

	var folder = folderName;

	document.getElementById('download-progress').style.width = '100%';
	document.getElementById('download-progress-counter').innerHTML = 'Done';
	document.getElementById('download-speed-counter').innerHTML = '';

	try {
		fs.readFile(app.getPath('userData') + '/Json/library.json', 'utf-8', function(err, data) {
			try {
				var arrayOfObjects = JSON.parse(data);
				arrayOfObjects.list.push({
					name: name,
					cover: cover,
					id: id,
					link: url,
					folder: folder
				});
				fs.writeFile(
					app.getPath('userData') + '/Json/library.json',
					JSON.stringify(arrayOfObjects),
					'utf-8',
					function(err) {
						if (err) makeLibrary();
					}
				);
			} catch (e) {
				makeLibrary();
			}
		});
	} catch (e) {
		makeLibrary();
	}

	function makeLibrary() {
		var list = {
			list: [
				{
					name: name,
					cover: cover,
					id: id,
					link: url,
					folder: folder
				}
			]
		};

		fs.writeFile(app.getPath('userData') + '/Json/library.json', JSON.stringify(list), 'utf-8', function(err) {
			if (err) console.log(err);
		});
	}
}
