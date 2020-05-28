exports.steamunlockedList = async(document, data) => {
  var total = data.length;
  var done = 0;
  await asyncForEach(data, async (url) => {
    try {
      var name = url
        .replace('https://steamunlocked.net/', '')
        .replace(/free.*download/, '')
        .replace("/", " ")
        .replace(/[-]/g, ' ');

      const client = igdb(localStorage.getItem('IGDBToken'));

      try {
        const response = await client
          .fields('id,cover')
          .search(name) // Search game by name
          .limit(1)
          .request('/games');

        const cover = await client
          .fields('url') //
          .where(`id = ` + response.data[0].cover)
          .request('/covers');

        var gameCover = cover.data[0].url.replace('t_thumb', 't_1080p').replace('//', 'https://');
        var gameID = response.data[0].id;
      } catch (e) {
        gameCover =
          'https://cdn.glitch.com/fb5beaf3-f18e-457d-9358-b09e28bf5522%2FGameNotFound.png?v=1590514540794';
        gameID = '1';
      }

      if (typeof gameCover === 'undefined') {
      }

      if (typeof gameID === 'undefined') {
      }

      fs.readFile(app.getPath('userData') + '/Json/store.json', 'utf-8', function(err, data) {
        if (err) throw err;

        var games = JSON.parse(data);
        games.list.push({
          name: name,
          cover: gameCover,
          id: gameID,
          link: url
        });

        fs.writeFile(app.getPath('userData') + '/Json/store.json', JSON.stringify(games), 'utf-8', function(
          err
        ) {
          if (err) throw err;
        });
      });

      done++;
      document.getElementById('generate-details').value = done + '/' + total;
    } catch (e) {}
  });
}