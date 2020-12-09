var searchBox = document.getElementById('game-search');
var fab = document.querySelector('.mdc-fab');

//If no file or key alert
if (!localStorage.getItem('SGDB_Key')) {
    alert('No Steam Grid Key');
    goto('Settings');
} else if (!localStorage.getItem('listFile')) {
    alert('No game file selected');
    goto('Settings');
}

//Function for searching
searchBox.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) searchGames();
});

function searchGames() {
    var search = searchBox.value;
    sessionStorage.setItem('gameSearch', search);
    if (search.length <= 2) return;
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
    var image = dialog.querySelector('#dialog-image');
    var download = dialog.querySelector('#download-button');

    showProgressBar();

    //Get id by name
    $.get(`https://api.rawg.io/api/games?search=${name}`, (output) => {
        //Detailed info by id
        $.get(`https://api.rawg.io/api/games/${output.results[0].id}`, (output) => {
            //Set description
            document.querySelector('#dialog-game-description').innerHTML = '<h3>Description</h3>' + output.description;

            //Add platforms / Release date
            document.querySelector('#platforms').innerHTML = '<b>Platforms</b>';
            document.querySelector('#release-date').innerHTML = '<b>Release dates</b>';
            output.platforms.forEach((platforms) => {
                var platformName = document.createElement('p');
                platformName.innerHTML = platforms.platform.name;
                document.querySelector('#platforms').appendChild(platformName);

                //Release date
                if (platforms.platform.name == 'PC') {
                    var releaseDate = document.createElement('p');
                    releaseDate.innerHTML = platforms.released_at;
                    document.querySelector('#release-date').appendChild(releaseDate);
                }
            });

            //Publishers
            document.querySelector('#publisher').innerHTML = '<b>Publishers</b>';
            output.publishers.forEach((publishers) => {
                var publisherName = document.createElement('p');
                publisherName.innerHTML = publishers.name;
                document.querySelector('#publisher').appendChild(publisherName);
            });

            //Developers
            document.querySelector('#developer').innerHTML = '<b>Developers</b>';
            output.developers.forEach((developers) => {
                var developerName = document.createElement('p');
                developerName.innerHTML = developers.name;
                document.querySelector('#developer').appendChild(developerName);
            });

            //genre
            document.querySelector('#genre').innerHTML = '<b>Genres</b>';
            output.genres.forEach((genres) => {
                var genreName = document.createElement('p');
                genreName.innerHTML = genres.name;
                document.querySelector('#genre').appendChild(genreName);
            });

            //Age rating
            document.querySelector('#age-rating').innerHTML = '<b>Age ratings</b>';
            var ageRating = document.createElement('p');
            try {
                ageRating.innerHTML = output.esrb_rating.name;
            } catch (e) {
                ageRating.innerHTML = 'Unkown';
            }
            document.querySelector('#age-rating').appendChild(ageRating);

            //Screenshots
            $.get(`https://api.rawg.io/api/games/${output.id}/screenshots`, (screenshots) => {

                document.querySelector('#game-screenshots').innerHTML = '';
                screenshots.results.forEach((screenshot) => {
                    var image = document.createElement('img');
                    image.src = screenshot.image;
                    document.querySelector('#game-screenshots').appendChild(image);
                });
            });
        });
    });

    fetch(name).then((game) => {
        openDialog('game-dialog');
        hideProgressBar();
        title.innerHTML = game.name;
        image.src = game.url;
        download.setAttribute('onclick', `downloadGame('${name}')`);
    });
}
