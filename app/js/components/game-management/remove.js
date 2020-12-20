function gameDelete(gameTitle, gameFolder, folderName, launchDefault) {
    //Dont do it if canceled
    if (!confirm(`Are you sure you want to delete ${folderName}`)) return;

    var file = path.join(appDataPath, '/Json/library.json');

    //delete folder from game
    rimraf(gameFolder, function () {
        //Remove deleted game from list
        $.getJSON(file, (data) => {
            var list = data['list'];

            //Function for getting key from game name
            function getKeyByValue(object, value) {
                return Object.keys(object).find((key) => {
                    return object[key].name === gameTitle;
                });
            }

            //Get key from game name
            var key = getKeyByValue(list, gameTitle);
            //Remove key corresponding to the game name
            delete list[key];
            //Make new array without the deleted key
            var newlist = {list: [...list]};
            //Remove undefined values
            newlist['list'] = newlist['list'].filter((n) => n);

            //Save to library json file
            fs.writeFile(file, JSON.stringify(newlist), function (err) {
                if (err) throw err;
                if (isDev) console.log('Saved!');
                goto('Installed');
            });
        });
    });
}
