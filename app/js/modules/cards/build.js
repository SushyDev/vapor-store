// ! Build installed card
exports.Installed = async (game) => {
    // ? Fetch game info from api

    const metadata = game.metadata[0];

    // ? Get background image from api, if not found use not found svg
    const cardContent = `
      <div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" onclick="vapor.cards.grid.openInstalled('${game.id}', '${game.directory}')">
    <div class="game-card__primary">
        <h2 class="game-card__title mdc-typography mdc-typography--headline6">${metadata.name}</h2>
        <h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">${game.id.replace(/-/g, ' ')}</h3>
    </div>
</div>`;

    const card = document.createElement('div');
    card.className = 'mdc-card';
    card.id = game.id;
    card.setAttribute('cover', `${game.id}-cover`);
    card.innerHTML = cardContent;
    card.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${metadata.background_image}')`;
    addCard(card, 'Installed');
};

// ! Build library card
exports.Library = async (fetchName) => {
    //If no cover is found use not found logo
    let gameInfo = await vapor.cards.query.fetch(fetchName);
    //Create the card

    const backgroundIMG = gameInfo.background_image ? gameInfo.background_image : '../img/not_found.svg';

    const cardContent = `
    <div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" onclick="vapor.cards.grid.openLibraryGame('${fetchName}')">
    <div class="game-card__primary">
        <h2 class="game-card__title mdc-typography mdc-typography--headline6">${gameInfo.name}</h2>
        <h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">${fetchName.replace(/-/g, ' ')}</h3>
    </div>
</div>
<div class="mdc-card__action-buttons">
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="downloader.fetchDownload('${fetchName}')"></span>Download</button>
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="vapor.cards.grid.openLibraryGame('${fetchName}')"></span>More</button>
</div>`;

    const card = document.createElement('div');
    card.className = 'mdc-card';
    card.id = gameInfo.id;
    card.innerHTML = cardContent;
    card.setAttribute('cover', `${fetchName}-cover`);
    card.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${backgroundIMG}')`;
    addCard(card, 'Library');
};

// ! Add metadata to page when opening game
exports.addMetadata = async (name, type, game) => {
    // # Fetch data
    const gameInfo = game?.metadata[0] || (await vapor.cards.query.fetch(name));
    const gameInfoExtra = await vapor.cards.query.fetchExtra(gameInfo.id);
    // # Set titles
    const titles = document.querySelectorAll('#selected-game-title');

    titles.forEach((title) => (title.innerHTML = innerHTML = gameInfo.name));

    // # Set description
    document.getElementById('selected-game-description').innerHTML = gameInfoExtra.description;

    // # When browsing a game in the store show the download size
    if (type == 'store')
        $.get(`https://steamunlocked.net/${name}`, (output) => {
            const pos = output.search('<em>Size:');
            const pos2 = output.search('</em><br');
            document.getElementById('selected-game-size').innerHTML = output.slice(pos + 10, pos2);
        });

    //Add platforms / Release date
    document.querySelector('#platforms').innerHTML = '<h1 class="mdc-typography--headline5">Platforms</h1>';
    document.querySelector('#release-date').innerHTML = '<h1 class="mdc-typography--headline5">Release dates</h1>';
    gameInfoExtra.platforms.forEach((platforms) => {
        const platformName = document.createElement('p');
        platformName.innerHTML = platforms.platform.name;
        document.querySelector('#platforms').appendChild(platformName);

        //Release date
        if (platforms.platform.name == 'PC') {
            const releaseDate = document.createElement('p');
            releaseDate.innerHTML = platforms.released_at;
            document.querySelector('#release-date').appendChild(releaseDate);
        }
    });

    //Publishers
    document.querySelector('#publisher').innerHTML = '<h1 class="mdc-typography--headline5">Publishers</h1>';
    gameInfoExtra.publishers.forEach((publishers) => {
        const publisherName = document.createElement('p');
        publisherName.innerHTML = publishers.name;
        document.querySelector('#publisher').appendChild(publisherName);
    });

    //Developers
    document.querySelector('#developer').innerHTML = '<h1 class="mdc-typography--headline5">Developers</h1>';
    gameInfoExtra.developers.forEach((developers) => {
        const developerName = document.createElement('p');
        developerName.innerHTML = developers.name;
        document.querySelector('#developer').appendChild(developerName);
    });

    //genre
    document.querySelector('#genre').innerHTML = '<h1 class="mdc-typography--headline5">Genres</h1>';
    gameInfoExtra.genres.forEach((genres) => {
        const genreName = document.createElement('p');
        genreName.innerHTML = genres.name;
        document.querySelector('#genre').appendChild(genreName);
    });

    //Age rating
    document.querySelector('#age-rating').innerHTML = '<h1 class="mdc-typography--headline5">Age ratings</h1>';
    const ageRating = document.createElement('p');
    ageRating.innerHTML = gameInfoExtra.esrb_rating ? gameInfoExtra.esrb_rating.name : 'Unknown';
    document.querySelector('#age-rating').appendChild(ageRating);

    //Screenshots
    document.querySelector('#game-screenshots').innerHTML = '';
    $.get(`https://api.rawg.io/api/games/${gameInfoExtra.id}/screenshots`, (screenshots) => {
        screenshots.results.forEach((screenshot) => {
            const image = document.createElement('img');
            image.src = screenshot.image;
            document.querySelector('#game-screenshots').appendChild(image);
        });
    });

    if (type == 'downloader') document.getElementById('selected-game-cover').style.backgroundImage = `url('${gameInfo.background_image}')`;

    try {
        document.getElementById('selected-game').style.display = 'initial';
    } catch (e) {}

    //Reset scroll
    $('#selected-game').scrollTop(0);
    vapor.ui.hideProgressBar();
};

// ! Append card to grid
function addCard(card, page) {
    const cards = document.getElementById('cards');
    // ? Add the card to the grid
    if (sessionStorage.getItem('page') == page) cards.appendChild(card);
    vapor.ui.hideProgressBar();
    // ? starts some material design components stuff on the newly added div
    window.mdc.autoInit();
    // ? Update masonry layout
    vapor.ui.updateGridLayout();
}
