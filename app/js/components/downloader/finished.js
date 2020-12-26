function addGameToLibrary(targetPath, targetFolder, gameTitle) {
    var file = path.join(appDataPath, '/Json/library.json');

    var folderName = targetFolder.split('/').pop();

    fs.readFile(file, 'utf-8', (err, data) => {
        var array;
        try {
            array = JSON.parse(data);
        } catch (e) {
            array = {list: []};
        }

        var updatedArray = array;
        updatedArray['list'].push({
            name: gameTitle,
            directory: targetFolder,
            folder: folderName,
        });

        fs.writeFile(file, JSON.stringify(updatedArray), function (err) {
            if (err) throw err;
            if (isDev) console.log('Saved!');
        });
    });
}
