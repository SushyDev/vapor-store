var searchBox = document.getElementById('searchquery');
var file = localStorage.getItem('listFile');

//If no file
if (!localStorage.getItem('listFile')) {
    MDCAlert('No game list file selected', 'Please download a game list file and select it in the settings');
    goto('Settings');
}

//Function for searching
searchBox.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) searchGames();
});

//CTRL + L for selecting searchbar
document.onkeyup = function (e) {
    if (e.ctrlKey && e.keyCode == 76) {
        searchBox.focus();
        searchBox.select();
    }
};

function searchGames() {
    var search = searchBox.value;
    sessionStorage.setItem('searchquery', search);
    //Hide active game list
    if (search.length <= 2) {
        showGenrePage();
        return;
    }
    showSearchPage();

    //Run the search games function
    createCard();
}

function clearSearch() {
    searchBox.value = '';
    showGenrePage();
}

function showGenrePage() {
    document.getElementById('selected-game').style.display = 'none';
    document.getElementById('cards').style.maxHeight = '0px';
    document.getElementById('genres').style.display = 'block';
}

function showSearchPage() {
    document.getElementById('selected-game').style.display = 'none';
    document.getElementById('cards').style.maxHeight = 'unset';
    document.getElementById('genres').style.display = 'none';
}

//Search games function
var createCardLatest;
function createCard() {
    try {
        var search = sessionStorage.getItem('searchquery').toLowerCase();
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
            buildCard(fetchName, 'store');
        });
    });
}
createCard();

//list some games based on category
$.getJSON(file, async (data) => {
    (async () => {
        showProgressBar();

        createCardLatest = Symbol();
        var createCardId = createCardLatest;
        var page = sessionStorage.getItem('page');

        var Action = 0;
        var Adventure = 0;
        var Indie = 0;
        var Racing = 0;
        var Sports = 0;
        while (!(Action + Adventure + Indie + Racing + Sports >= 50)) {
            var gameAmount = data['list'].length;
            var randomGame = Math.floor(Math.random() * gameAmount);
            var game = data['list'][randomGame];

            if (createCardId !== createCardLatest) return;
            if (page != sessionStorage.getItem('page')) return;
            var fetchData = await fetch(game.name);

            fetchData.genres.forEach(async (genre) => {
                if (genre.name == 'Action') {
                    if (Action >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Action++;
                } else if (genre.name == 'Adventure') {
                    if (Adventure >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Adventure++;
                } else if (genre.name == 'Indie') {
                    if (Indie >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Indie++;
                } else if (genre.name == 'Racing') {
                    if (Racing >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Racing++;
                } else if (genre.name == 'Sports') {
                    if (Sports >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Racing++;
                }
            });
        }
        hideProgressBar();
    })();
});

function createGenreCard(fetchData, gameName, genre) {
    var fetchName = gameName.replace(/ /g, '-').substring(1).slice(0, -1);
    var cardContent = `
        <div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, .5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${fetchData.background_image}')" id="${fetchName}-cover"  onclick="openStoreGame('${fetchName}')">
            <div class="game-card__primary">
                <h2 class="game-card__title mdc-typography mdc-typography--headline6">${fetchData.name}</h2>
                </div>
                </div>
                <div class="mdc-card__action-buttons">
                    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="fetchDownload('${fetchName}')" ></span>Download</button>
                    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="openStoreGame('${fetchName}')"></span>More</button>
                </div>
`;

    var card = document.createElement('div');
    card.className = 'mdc-card';
    card.id = fetchData.id;
    card.innerHTML = cardContent;
    document.getElementById(`genre-${genre}-cards`).appendChild(card);
    window.mdc.autoInit();
}
