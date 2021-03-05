const searchBox = () => document.getElementById('installed-searchquery');

exports.Initialize = () => {
    //Function for searching
    searchBox().addEventListener('keyup', function (event) {
        if (event.keyCode == 13) page.installed.searchInstalledGames();
    });

    // ? CTRL + L for selecting searchbar
    document.onkeyup = function (e) {
        if (e.ctrlKey && e.keyCode == 76) {
            searchBox().focus();
            searchBox().select();
        }
    };

    page.installed.createCard();
};

exports.createCard = (search = undefined) => {
    cards.innerHTML = '';

    vapor.ui.showProgressBar();

    // ? Close game info page
    vapor.cards.grid.closeGameTab();

    // ? Read the store games list json file
    $.getJSON(vapor.fn.installedGames(), (data) => {
        if (data['list'] == '') vapor.ui.hideProgressBar();

        data['list'].forEach((game) => {
            // ? If there is a search and there is a game that isn't in the search dont do anything
            if (search && !game.id.includes(search.toLowerCase())) return;

            // ? Fetch data from the game by name
            vapor.cards.build.Installed(game);
        });
    });
};

exports.searchInstalledGames = () => (searchBox().value ? page.installed.createCard(searchBox().value) : page.installed.createCard());

exports.addGame = () => {
    vapor.ui.dialog.MDCAlert('Not implemented yet', 'Please wait for future updates');
};
