//Select which card to use
function selectCard(gameInfo, fetchName, type) {
    var gameName = gameInfo.name;
    var gameCover = gameInfo.url;
    var gameId = gameInfo.id;
    var gameFolder = gameInfo.folder.replace(/\\/g, '/');
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
<div class="mdc-card__primary-action" data-mdc-auto-init="MDCRipple">
    <div class="mdc-card__media mdc-card__media--square">
        <img id="${fetchName}" data-src="${gameCover}" class="lazyload" onclick="Start('${gameInfo.name}', '${gameFolder}', '${gameInfo.fileName}')" onload="imgLoad(this)" />
    </div>
    <div class="card-content"></div>
</div>
<div class="mdc-card__actions">
    <div class="game-title">
        <p>${gameName}</p>
    </div>

    <div class="mdc-card__action-icons">
   
    <button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" data-mdc-ripple-is-unbounded="true" data-mdc-auto-init="MDCRipple" onclick="gameDelete('${gameInfo.name2}', '${gameFolder}', '${gameInfo.fileName}')" title="Remove">delete</button>
    <button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" data-mdc-ripple-is-unbounded="true" data-mdc-auto-init="MDCRipple" onclick="Start('${gameInfo.name}', '${gameFolder}', '${gameInfo.fileName}')" title="Play">play_arrow</button>
    </div>
</div>
`;
        //No game settings yet, needs to be implemented when adding custom games
        //<button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" data-mdc-ripple-is-unbounded="true" data-mdc-auto-init="MDCRipple" onclick="gameSettings('${gameInfo.name}', '${gameFolder}', '${gameInfo.fileName}')" title="Settings">settings</button>
    } else {
        //Card for store
        return `
<div class="mdc-card__primary-action" data-mdc-auto-init="MDCRipple">
    <div class="mdc-card__media mdc-card__media--square">
        <img id="${fetchName}" data-src="${gameCover}" class="lazyload unloaded" onclick="openStoreGame('${fetchName}')" onload="imgLoad(this)" />
    </div>
    <div class="card-content"></div>
</div>
<div class="mdc-card__actions">
    <div class="game-title">
        <p>${gameName}</p>
    </div>

    <div class="mdc-card__action-icons">
    <button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" data-mdc-ripple-is-unbounded="true" data-mdc-auto-init="MDCRipple" onclick="downloadGame('${fetchName}')" title="Download">get_app</button>
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
