var textBox = document.getElementById('game-name');

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
        console.log(e);
        return;
    }

    showProgressBar();

    createCardLatest = Symbol();
    var createCardId = createCardLatest;

    fetch(search).then((gameInfo) => {
        //Stop if new search
        if (createCardId !== createCardLatest) return;
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
