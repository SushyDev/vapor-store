var searchBox = document.getElementById('game-search');
var fab = document.querySelector('.mdc-fab');

//If no file or key alert
if (!localStorage.getItem('SGDB_Key')) {
    alert('No Steam Grid Key')
    goto('Settings')
} else if (!localStorage.getItem('listFile')) { 
    alert('No game file selected')
    goto('Settings')
}

//Function for searching
searchBox.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) searchGames();
});

function searchGames() {
    sessionStorage.setItem('gameSearch', searchBox.value);
    searchBox.value = '';
    //Run the search games function
    createCard();
    closeSearchFAB();
}
//Search games function
var createCardLatest;
function createCard() {
    var file = localStorage.getItem('listFile');

    try {
        var search = sessionStorage.getItem('gameSearch').toLowerCase();
    } catch (e) {
        return;
    }

    //Remove previous cards
    cards.innerHTML = '';
    showProgressBar();

    createCardLatest = Symbol();
    var createCardId = createCardLatest;
    var page = sessionStorage.getItem('page');

    //Read the store games list json file
    $.getJSON(file, (data) => {
        //Stop if new search
        if (createCardId !== createCardLatest) return;
        //For every game in the list
        data['list'].forEach((game) => {
            //Stop if new search
            if (createCardId !== createCardLatest) return;
            if (!game.name.includes(search)) return;

            //Format name for url
            var fetchName = game.name.replace(/ /g, '-').substring(1).slice(0, -1);

            //Fetch data from the game by name
            fetch(fetchName).then((gameInfo) => {
                //Stop if new search or different page
                if (createCardId !== createCardLatest) return;
                if (page != sessionStorage.getItem('page')) return;
                buildCard(gameInfo, fetchName, 'store', page);
            });
        });
    });
}
createCard();

//Executes this when a user clicks the download button or the cover art of a game
function selectGame(game) {
    getGameByName(game).then((output) => {
        devLog(output[0]);
    });
}

function openSearchFAB() {
    fab.classList.add('mdc-fab--extended');
    searchBox.focus();
}

function closeSearchFAB() {
    fab.classList.remove('mdc-fab--extended');
}

//Open store game dialog
function openStoreGame(name) {
    var dialog = document.querySelector('#game-dialog');
    var title = dialog.querySelector('#dialog-title');
    var image = dialog.querySelector('#dialog-image');
    var download = dialog.querySelector('#download-button');

    showProgressBar();

    fetch(name).then((game) => {
        openDialog('game-dialog');
        hideProgressBar();
        title.innerHTML = game.name;
        image.src = game.url;
        download.setAttribute('onclick', `downloadGame('${name}')`);
    });
}