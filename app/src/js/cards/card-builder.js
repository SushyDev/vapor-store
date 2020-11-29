//Select which card to use
function selectCard(gameInfo, fetchName, type) {
    var gameName = gameInfo.name;
    var gameCover = gameInfo.url;
    var gameId = gameInfo.id;
    if (gameCover == undefined) gameCover = '../img/not_found.svg';

    if (type == 'backup') {
        //Card for backup
        return `
<div class="mdc-card__primary-action" data-mdc-auto-init="MDCRipple">
    <div class="mdc-card__media mdc-card__media--square">
        <img id="${fetchName}" data-src="${gameCover}" class="lazyload" onclick="openSyncGame('${fetchName}')" onload="setLayout();" />
    </div>
    <!-- ... additional primary action content ... -->
    <div class="card-content"></div>
</div>
<div class="mdc-card__actions">
    <div class="game-title">
        <p>${gameName}</p>
    </div>

    <div class="mdc-card__action-icons" data-mdc-auto-init="MDCRipple">
        <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" onclick="removeGameFromList('${gameId}')" title="Remove">delete</button>
    </div>
</div>
`;
    } else {
        //Card for store
        return `
<div class="mdc-card__primary-action" data-mdc-auto-init="MDCRipple">
    <div class="mdc-card__media mdc-card__media--square">
        <img id="${fetchName}" data-src="${gameCover}" class="lazyload" onclick="openStoreGame('${fetchName}')" onload="setLayout();" />
    </div>
    <!-- ... additional primary action content ... -->
    <div class="card-content"></div>
</div>
<div class="mdc-card__actions">
    <div class="game-title">
        <p>${gameName}</p>
    </div>

    <div class="mdc-card__action-icons" data-mdc-auto-init="MDCRipple">
        <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" onclick="selectGame('${gameName}')" title="Download">get_app</button>
    </div>
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
    //Lazyload
    new LazyLoad(document.querySelectorAll('.lazyload'));
}
