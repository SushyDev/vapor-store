exports.Initialize = () => {
    const searchBox = vapor.cards.grid.searchBox();
    const file = vapor.config.get().listFile;

    //If no file
    if (!file) {
        vapor.ui.dialog.MDCAlert('No game list file selected', 'Please download a game list file and select it in the settings');
        vapor.nav.goto('Settings');
    }

    //Function for searching
    searchBox.addEventListener('keyup', (event) => {
        if (event.keyCode == 13) page.library.searchGames();
    });

    //CTRL + L for selecting searchbar
    document.onkeyup = (event) => {
        if (event.ctrlKey && event.keyCode == 76) {
            searchBox.focus();
            searchBox.select();
        }
    };

    createCard();

    //list some games based on category
    $.getJSON(file, async (data) => {
        vapor.ui.showProgressBar();

        //set page
        const page = sessionStorage.getItem('page');
        let Action = 0;
        let Strategy = 0;
        let Adventure = 0;
        let Simulation = 0;
        let Indie = 0;
        while (!(Action + Adventure + Indie + Simulation + Strategy >= 50)) {
            const gameAmount = data['list'].length;
            const randomGame = Math.floor(Math.random() * gameAmount);
            const game = data['list'][randomGame];

            // ? If game doesn't exist don't do anyhting
            if (!game.name) return;

            //Cancel is not on page anymore
            if (page != sessionStorage.getItem('page')) return;

            const fetchData = await vapor.cards.query.fetch(game.name);

            if (!fetchData) return;

            fetchData.genres.forEach(async (genre) => {
                if (genre.name == 'Action') {
                    if (Action >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Action++;
                    return;
                } else if (genre.name == 'Adventure') {
                    if (Adventure >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Adventure++;
                    return;
                } else if (genre.name == 'Indie') {
                    if (Indie >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Indie++;
                    return;
                } else if (genre.name == 'Simulation') {
                    if (Simulation >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Simulation++;
                    return;
                } else if (genre.name == 'Strategy') {
                    if (Strategy >= 10) return;
                    createGenreCard(fetchData, game.name, genre.name);
                    Strategy++;
                    return;
                }
            });
        }
        vapor.ui.hideProgressBar();
    });

    function createGenreCard(gameInfo, gameName, genre) {
        const gameID = gameName.replace(/ /g, '-').substring(1).slice(0, -1);
        const cardContent = `
<div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" id="${gameID}-cover" onclick="vapor.cards.grid.openLibraryGame('${gameID}')">
    <div class="game-card__primary">
        <h2 class="game-card__title mdc-typography mdc-typography--headline6">${gameInfo.name}</h2>
        <h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">${gameName}</h3>
    </div>
</div>
<div class="mdc-card__action-buttons">
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="downloader.fetchDownload('${gameID}')"></span>Download</button>
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="vapor.cards.grid.openLibraryGame('${gameID}')"></span>More</button>
</div>
`;

        if (sessionStorage.getItem('page') != 'Library') return;

        const card = document.createElement('div');
        card.className = 'mdc-card';
        card.id = gameInfo.id;
        card.innerHTML = cardContent;
        card.setAttribute('cover', `${gameID}-cover`);
        card.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${gameInfo.background_image}')`;
        document.getElementById(`genre-${genre}-cards`).appendChild(card);
        window.mdc.autoInit();
    }
};

exports.searchGames = () => {
    const searchBox = vapor.cards.grid.searchBox();

    const search = searchBox.value;
    sessionStorage.setItem('searchquery', search);
    //Hide active game list
    if (search.length < 1) page.library.showGenrePage();
    showSearchPage();

    //Run the search games function
    createCard();
};

function showSearchPage() {
    document.getElementById('selected-game').style.display = 'none';
    document.getElementById('cards').style.maxHeight = 'unset';
    document.getElementById('genres').style.display = 'none';
}

// ! Search games function
function createCard() {
    const file = vapor.config.get().listFile;

    // ? If there is a search query do that
    const search = sessionStorage.getItem('searchquery') ? sessionStorage.getItem('searchquery').toLowerCase() : undefined;

    //Remove previous cards
    cards.innerHTML = '';
    vapor.ui.showProgressBar();

    //set page
    const page = sessionStorage.getItem('page');

    //Read the library games list json file
    $.getJSON(file, (data) => {
        //Cancel is not on page anymore
        if (page != sessionStorage.getItem('page')) return;
        //For every game in the list
        data['list'].forEach((game) => {
            if (!game.name.includes(search)) return;
            //Cancel is not on page anymore
            if (page != sessionStorage.getItem('page')) return;
            //Format name for url
            const fetchName = game.name.replace(/ /g, '-').substring(1).slice(0, -1);
            //Fetch data from the game by name
            vapor.cards.build.Library(fetchName);
        });
    });
}

exports.showGenrePage = () => {
    document.getElementById('selected-game').style.display = 'none';
    document.getElementById('cards').style.maxHeight = '0px';
    document.getElementById('genres').style.display = 'block';
};
