exports.closeGameTab = () => (document.getElementById('selected-game').style.display = 'none');

exports.openLibraryGame = (name) => {
    vapor.ui.showProgressBar();

    //close drawer
    drawer.open = false;

    document.getElementById('selected-game-cover').style.background = document.getElementById(`${name}-cover`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-download').setAttribute('onclick', `downloader.fetchDownload('${name}')`);

    vapor.cards.build.addMetadata(name, 'store');
};

//Show game info page
exports.openInstalled = async (name, gameInfoName, gameDir) => {
    vapor.ui.showProgressBar();

    const folderName = gameDir.split('/').pop();

    //close drawer
    drawer.open = false;

    //remove menu
    document.getElementById('menu-anchorpoint').innerHTML = '';

    document.getElementById('selected-game-cover').style.background = document.getElementById(`${name}-cover`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-cover').setAttribute('onclick', `management.game.listGameExec('${gameInfoName}', '${gameDir}', '${folderName}', true)`);
    document.getElementById('selected-game-play').setAttribute('onclick', `management.game.listGameExec('${gameInfoName}', '${gameDir}', '${folderName}', true)`);
    document.getElementById('selected-game-more').setAttribute('onclick', `management.game.openMore('${gameInfoName}', '${name}', '${gameDir}', '${folderName}')`);
    document.getElementById('menu-anchorpoint').setAttribute('anchorfor', `${gameInfoName}`);

    vapor.cards.build.addMetadata(name, 'installed');
};

exports.clearSearch = () => {
    vapor.cards.grid.searchBox().value = '';
    if (sessionStorage.getItem('page') == 'Library') vapor.pages.library.showGenrePage();
};

exports.searchBox = () => document.getElementById('searchquery');
