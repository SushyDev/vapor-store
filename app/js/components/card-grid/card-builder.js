//Select which card to use
function selectCard(gameInfo, fetchName, type) {
    var gameName = gameInfo.name;
    var gameCover = gameInfo.url;
    var gameId = gameInfo.id;

    try {
        var gameFolder = gameInfo.folder.replace(/\\/g, '/');
    } catch (e) {
        //No game folder
    }
    if (gameCover == undefined) gameCover = '../img/not_found.svg';

    if (type == 'backup') {
        //Card for backup
        return `
<div class="mdc-card__primary-action" data-mdc-auto-init="MDCRipple">
    <div class="mdc-card__media mdc-card__media--square">
        <img id="${fetchName}" data-src="${gameCover}" class="lazyload" onclick="openSyncGame('${fetchName}')" onload="imgLoad(this)" />
    </div>
    <div class="card-content"></div>
</div>
<div class="mdc-card__actions">
    <div class="game-title">
        <p>${gameName}</p>
    </div>

    <div class="mdc-card__action-icons">
    <button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" data-mdc-ripple-is-unbounded="true" data-mdc-auto-init="MDCRipple" onclick="removeGameFromList('${gameId}')" title="Remove">delete</button>
    </div>
</div>
`;
    } else if (type == 'installed') {
        //Card for installed
        return `
<div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${gameCover}')" id="${fetchName}-cover" onclick="openInstalled('${fetchName}', '${gameInfo.name}', '${gameFolder}', '${gameInfo.fileName}')">
    <div class="game-card__primary">
        <h2 class="game-card__title mdc-typography mdc-typography--headline6">${gameName}</h2>
    </div>
</div>
`;
    } else {
        //Card for store
        return `
<div class="mdc-card__primary-action" tabindex="0" data-mdc-auto-init="MDCRipple" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 25%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%), url('${gameCover}')" id="${fetchName}-cover" onclick="openStoreGame('${fetchName}')">
    <div class="game-card__primary">
        <h2 class="game-card__title mdc-typography mdc-typography--headline6">${gameName}</h2>
    </div>
</div>
<div class="mdc-card__action-buttons">
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="fetchDownload('${fetchName}')"></span>Download</button>
    <button class="mdc-button mdc-card__action mdc-card__action--button" data-mdc-auto-init="MDCRipple"><span class="mdc-button__ripple" onclick="openStoreGame('${fetchName}')"></span>More</button>
</div>
`;
    }
}

//Add data to the card
function buildCard(gameInfo, fetchName, type = 'store') {
    //If no cover is found use not found logo

    //Create the card
    var card = document.createElement('div');
    card.className = 'mdc-card';
    card.id = gameInfo.id;
    card.innerHTML = selectCard(gameInfo, fetchName, type);
    addCard(card);
}

//Add card to grids
function addCard(card) {
    //Add the card to the grid
    cards.appendChild(card);
    //Hide progressbar when cards are added
    hideProgressBar();
    //starts some material design components stuff on the newly added div
    window.mdc.autoInit();
    //Masonry layout
    setLayout();
}
