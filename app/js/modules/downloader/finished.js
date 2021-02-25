exports.addGameToLibrary = (targetPath, targetFolder, gameTitle) => {
    const folderName = targetFolder.split('/').pop();

    fs.readFile(vapor.fn.installedGames(), 'utf-8', (err, data) => {
        const array = JSON.parse(data) ? JSON.parse(data) : {list: []};

        let updatedArray = array;
        updatedArray['list'].push({
            name: gameTitle,
            directory: targetFolder,
            folder: folderName,
        });

        fs.writeFile(vapor.fn.installedGames(), JSON.stringify(updatedArray), function (err) {
            if (err) throw err;
            if (isDev) console.log('Saved!');
        });
    });
};
