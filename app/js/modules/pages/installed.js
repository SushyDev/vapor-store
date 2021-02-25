const searchBox = () => document.getElementById('installed-searchquery');

exports.Initialize = () => {
    //Function for searching
    searchBox().addEventListener('keyup', function (event) {
        if (event.keyCode == 13) vapor.pages.installed.searchInstalledGames();
    });

    //CTRL + L for selecting searchbar
    document.onkeyup = function (e) {
        if (e.ctrlKey && e.keyCode == 76) {
            searchBox().focus();
            searchBox().select();
        }
    };

    vapor.pages.installed.createCard();

    // ! Remove this? => vapor.management.listExec();
};

exports.createCard = (search = undefined) => {
    //Remove previous cards
    cards.innerHTML = '';
    vapor.ui.showProgressBar();

    //Close gamestab
    vapor.cards.grid.closeGameTab();

    //Read the store games list json file
    $.getJSON(vapor.fn.installedGames(), (data) => {
        if (data['list'] == '') vapor.ui.hideProgressBar();

        //For every game in the list
        data['list'].forEach((game) => {
            // # If there is a search and there is a game that isn't in the search dont do anything
            if (search && !game.name.includes(search.toLowerCase())) return;

            const gameDir = game.directory;
            const folderName = game.folder;

            const fetchName = game.name.replace(/ /g, '-');
            //Fetch data from the game by name
            vapor.cards.build.Installed(fetchName, 'installed', gameDir, folderName);
        });
    });
};

exports.searchInstalledGames = () => (searchBox().value ? vapor.pages.installed.createCard(searchBox().value) : vapor.pages.installed.createCard());

