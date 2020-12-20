var searchBox = document.getElementById('installed-searchquery');
var file = path.join(appDataPath, '/Json/library.json');

//Function for searching
searchBox.addEventListener('keyup', function (event) {
    if (event.keyCode == 13) searchInstalledGames();
});

//CTRL + L for selecting searchbar
document.onkeyup = function (e) {
    if (e.ctrlKey && e.keyCode == 76) {
        searchBox.focus();
        searchBox.select();
    }
};

var createCardLatest;
function createCard(search = undefined) {
    //Remove previous cards
    cards.innerHTML = '';
    showProgressBar();

    //Close gamestab
    closeGameTab();

    createCardLatest = Symbol();
    var createCardId = createCardLatest;
    var page = sessionStorage.getItem('page');

    //Read the store games list json file
    $.getJSON(file, (data) => {
        //Stop if new search
        if (createCardId !== createCardLatest) return;

        if (data['list'][0] == undefined) {
            MDCAlert('No games installed', 'Please install some games to continue');
            goto('Store');
        }

        //For every game in the list
        data['list'].forEach((game) => {
            //Stop if new search

            if (search != undefined) {
                if (!game.name.includes(search.toLowerCase())) return;
            }
            if (createCardId !== createCardLatest) return;

            //Format name for url

            var gameDir = game.directory;
            var folderName = game.folder;

            var fetchName = game.name.replace(/ /g, '-');
            //Fetch data from the game by name
            buildCard(fetchName, 'installed', gameDir, folderName);
        });
    });
}
createCard();

function searchInstalledGames() {
    if (searchBox.value == '') {
        createCard();
    } else {
        createCard(searchBox.value);
    }
}

//Show game info page
async function openInstalled(name, gameInfoName, gameDir) {
    showProgressBar();

    var folderName = gameDir.split('/').pop();

    //close drawer
    drawer.open = false;

    //remove menu
    document.getElementById('menu-anchorpoint').innerHTML = '';

    document.getElementById('selected-game-cover').style.background = document.getElementById(`${name}-cover`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-cover').setAttribute('onclick', `gameListExec('${gameInfoName}', '${gameDir}', '${folderName}', true)`);
    document.getElementById('selected-game-play').setAttribute('onclick', `gameListExec('${gameInfoName}', '${gameDir}', '${folderName}', true)`);
    document.getElementById('selected-game-more').setAttribute('onclick', `openMore('${gameInfoName}', '${name}', '${gameDir}', '${folderName}')`);
    document.getElementById('menu-anchorpoint').setAttribute('anchorfor', `${gameInfoName}`);

    addMetadata(name, 'installed');
}

//Open more options popup
function openMore(name, name2, gameDir, folderName) {
    var anchorpoint = document.querySelector(`div[anchorfor="${name}"]`);

    if (!anchorpoint.innerHTML == '') {
        anchorpoint.innerHTML = '';
    } else {
        anchorpoint.innerHTML = `
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
    <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="selectDefault('${name2}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Select default exe</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameListExec('${name}', '${gameDir}', '${folderName}', false)">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">List executables</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameShortcut('${name}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Add to desktop</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="openFolder('${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Open folder</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameDelete('${name2}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Delete</span>
            </li>
        </ul>
    </div>
</div>

`;
    }
}
