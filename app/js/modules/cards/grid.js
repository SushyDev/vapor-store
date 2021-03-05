exports.closeGameTab = () => (document.getElementById('selected-game').style.display = 'none');

exports.openLibraryGame = (name) => {
    vapor.ui.showProgressBar();

    //close drawer
    drawer.open = false;

    document.getElementById('selected-game-cover').style.background = document.querySelector(`div[cover='${name}-cover']`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-download').setAttribute('onclick', `downloader.fetchDownload('${name}')`);

    vapor.cards.build.addMetadata(name, 'store');
};

//When open a game in installed page then fill contents
exports.openInstalled = async (gameID) => {
    vapor.ui.showProgressBar();

    const installedGameList = await $.get(vapor.fn.installedGames());
    const gameKey = vapor.fn.getKeyByValue(installedGameList.list, 'id', gameID);
    const game = installedGameList.list[gameKey];

    // ? Close drawer
    drawer.open = false;

    // ? Remove popup menu anchorpoint
    document.getElementById('menu-anchorpoint').innerHTML = '';

    document.getElementById('selected-game-cover').style.background = document.querySelector(`div[cover='${game.id}-cover']`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    document.getElementById('selected-game-cover').setAttribute('onclick', `manage.game.listGameExec('${game.id}', '${game.directory}', true)`);
    document.getElementById('selected-game-play').setAttribute('onclick', `manage.game.listGameExec('${game.id}', '${game.directory}', true)`);
    document.getElementById('selected-game-more').setAttribute('onclick', `manage.game.openMore('${game.id}')`);
    document.getElementById('menu-anchorpoint').setAttribute('anchorfor', `${game.id}`);

    vapor.cards.build.addMetadata(undefined, 'installed', game);
};

exports.clearSearch = () => {
    vapor.cards.grid.searchBox().value = '';
    if (sessionStorage.getItem('page') == 'Library') page.library.showGenrePage();
};

exports.searchBox = () => document.getElementById('searchquery');
