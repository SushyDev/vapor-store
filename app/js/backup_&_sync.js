var textBox = document.getElementById('game-name');

//Page is developer only!
if (!isDev) {
    alert('This page is not ready yet')
    goto('Home')
}

textBox.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) document.getElementById('add-games').click();
});

function openAddDialog() {
    openDialog('add-game-dialog');
    textBox.focus();
}

function closeAddDialog(elem) {
    closeDialog(elem);
    textBox.value = '';
}

function addCardToGrid(elem) {
    createCard(textBox.value);
    closeDialog(elem);
}

var createCardLatest;
function createCard(gameName) {
    try {
        var search = gameName.toLowerCase();
    } catch (e) {
        devLog(e);
        return;
    }

    showProgressBar();

    createCardLatest = Symbol();
    var createCardId = createCardLatest;
    var page = sessionStorage.getItem('page');

    fetch(search).then((gameInfo) => {
        //Stop if new search or different page
        if (createCardId !== createCardLatest) return;
        if (page != sessionStorage.getItem('page')) return;
        var type = 'backup';

        //Remove card if already exists
        try {
            removeGameFromList(gameInfo.id);
        } catch (e) {
            //Card doesn't exist
        }

        buildCard(gameInfo, search, type);
    });
}

function removeGameFromList(gameId) {
    document.getElementById(gameId).remove();
    setLayout();
}

//Open sync game dialog
function openSyncGame(name) {
    var dialog = document.querySelector('#game-dialog');
    var title = dialog.querySelector('#dialog-title');
    var image = dialog.querySelector('#dialog-image');

    showProgressBar();

    fetch(name).then((game) => {
        openDialog('game-dialog');
        hideProgressBar();
        title.innerHTML = game.name;
        image.src = game.url;
    });
}
