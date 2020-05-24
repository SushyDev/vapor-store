async function loadPageContents() {
	var name = sessionStorage.getItem('selectedGameName');
	var cover = sessionStorage.getItem('selectedGameCover');
	var id = sessionStorage.getItem('selectedGameID');
	var url = sessionStorage.getItem('selectedGameLink');

	const client = igdb(localStorage.getItem('IGDBToken'));

	const info = await client
		.fields('id,name,cover,summary,total_rating,screenshots,artworks,first_release_date')
		.where(`id = ` + id) // Search game by id
		.request('/games');

	var release = new Date(info.data[0].first_release_date * 1000);
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
	var year = release.getFullYear();
	var month = months[release.getMonth()];
	var date = release.getDate();

	var screenshots = info.data[0].screenshots;
	var artworks = info.data[0].artworks;

	if (typeof artworks !== 'undefined') {
		async function getArtworks() {
			const info = await client
				.fields('url')
				.where(`id = ` + artworks[0]) // Search game by id
				.request('/artworks');

			var url = info.data[0].url.replace('//', 'https://').replace('t_thumb', 't_1080p');
			document.getElementById('background').style.backgroundImage = 'url(' + url + ')';
		}
		getArtworks();
	}

	try {
		screenshots.forEach((screenshot) => {
			async function getScreenshots() {
				const info = await client
					.fields('url')
					.where(`id = ` + screenshot) // Search game by id
					.request('/screenshots');

				var screenshotImg = document.createElement('img');
				screenshotImg.src = info.data[0].url.replace('//', 'https://').replace('t_thumb', 't_1080p');
				screenshotImg.className = 'game-screenshot';
				document.getElementById('game-screenshots').appendChild(screenshotImg);
			}
			getScreenshots();
		});
	} catch (e) {
		document.getElementById('game-screenshot-menu').style.display = 'none';
	}

	var time = year + ' ' + month + ' ' + date;
	var rating = info.data[0].total_rating / 20;
	var stars = Number(Math.round(rating + 'e0') + 'e-0');

	var dataArray = { name: name, cover: cover, id: id, link: url };
	var data = JSON.stringify(dataArray);

	document.getElementById('game-title').innerHTML = name;
	document.getElementById('game-cover').src = cover;
	document.getElementById('game-desc').innerHTML = info.data[0].summary;
	document.getElementById('game-date').innerHTML = 'Released: ' + time;
	document.getElementById('game-rating').innerHTML = stars + '/5 Stars';
	document.getElementById('game-download').setAttribute('onclick', 'Download(' + "'" + data + "'" + ')');
}

loadPageContents();

function screenshotsScroll(direction) {
	if (direction == 'left') {
		document.getElementById('game-screenshots').scrollLeft -= 300;
	} else {
		document.getElementById('game-screenshots').scrollLeft += 300;
	}
}
