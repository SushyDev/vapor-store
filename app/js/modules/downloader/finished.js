exports.addGameToLibrary = (gameDir, gameID) => {
    fs.readFile(vapor.fn.installedGames(), 'utf-8', async (err, data) => {
        
        const array = JSON.parse(data) ? JSON.parse(data) : {list: []};
        const gameInfo = await vapor.cards.query.fetch(gameID);
        const exists = vapor.fn.getKeyByValue(array.list, 'id', gameID);
        let updatedArray = array;



        // ? If game alreadt was installed overwrite data in the list
        if (exists) {
            updatedArray['list'][exists] = {
                id: gameID,
                directory: gameDir,
                metadata: [gameInfo],
            };
        } else {
            updatedArray['list'].push({
                id: gameID,
                directory: gameDir,
                metadata: [gameInfo],
            });
        }

        fs.writeFile(vapor.fn.installedGames(), JSON.stringify(updatedArray), function (err) {
            if (err) throw err;
            if (isDev) console.log('Saved!');
        });
    });
};
