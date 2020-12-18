//Gets gameinfo by name
function getGameByName(gameName) {
    return client.searchGame(gameName).then(async (output) => {
        return output;
    });
}

//Gets cover data from id
//id is fetched from the gameinfo by name
function getCoverById(gameID) {
    return client.getGrids({type: 'game', id: gameID}).then((output) => {
        return output;
    });
}

//Fetches steamgriddb data
function fetch(name) {
    //First gets game by name
    //Then use the id fetched from the name to search the cover by id
    //then return both arrays that are fetched from the steamgriddb
    return getGameByName(name).then((nameResult) => {
        var id = nameResult[0].id;
        return getCoverById(id).then((IDResult) => {
            if (!IDResult[0]) {
                IDResult[0] = {...IDResult[0], url: '../img/game-cover.png'};
            }

            return {...IDResult[0], ...nameResult[0]};
        });
    });
}

//Updates masonry layout
function setLayout() {
    //Don't format home page
    if (sessionStorage.getItem('page') == 'Home') return;
    try {
        var grid = new Minigrid({
            container: '.cards',
            item: '.mdc-card',
            gutter: 24,
        });
        grid.mount();
    } catch (e) {}
}

//On resize update masonry layout
try {
    let resizeObserver = new ResizeObserver(() => {
        setLayout();
    });
    resizeObserver.observe($('.cards')[0]);
} catch (e) {}

function imgLoad(img) {
    setLayout();
    img.classList.remove('unloaded');
}

//Open more options popup
function openMore(name, name2, folder, fileName) {
    var anchorpoint = document.querySelector(`div[anchorfor="${name}"]`);

    if (!anchorpoint.innerHTML == '') {
        anchorpoint.innerHTML = '';
    } else {
        anchorpoint.innerHTML = `
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
    <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="openFolder('${folder}', '${fileName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Open folder</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameDelete('${name2}', '${folder}', '${fileName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Delete</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameShortcut('${name2}', '${folder}', '${fileName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Add to desktop</span>
            </li>
        </ul>
    </div>
</div>
`;
    }
}

async function openStoreGame(name) {
    showProgressBar();

    //close drawer
    drawer.open = false;

    document.getElementById('selected-game-cover').style.background = document.getElementById(`${name}-cover`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-download').setAttribute('onclick', `fetchDownload('${name}')`);

    addMetadata(name, 'store');
}

async function openInstalled(name, gameInfoName, gameFolder, fileName) {
    showProgressBar();

    //close drawer
    drawer.open = false;

    document.getElementById('selected-game-cover').style.background = document.getElementById(`${name}-cover`).style.backgroundImage;
    document.getElementById('selected-game-cover').style.backgroundSize = 'cover';
    document.getElementById('selected-game-cover').style.backgroundPosition = 'center';

    //Set download button
    document.getElementById('selected-game-cover').setAttribute('onclick', `gameListExec('${gameInfoName}', '${gameFolder}', '${fileName}')`);
    document.getElementById('selected-gam-play').setAttribute('onclick', `gameListExec('${gameInfoName}', '${gameFolder}', '${fileName}')`);
    document.getElementById('selected-game-more').setAttribute('onclick', `openMore('${gameInfoName}', '${name}', '${gameFolder}', '${fileName}')`);
    document.getElementById('menu-anchorpoint').setAttribute('anchorfor', `${gameInfoName}`);

    addMetadata(name, 'installed');
}

function closeGameTab() {
    document.getElementById('selected-game').style.display = 'none';
}

function addMetadata(name, type) {
    //Fetch data
    $.get(`https://api.rawg.io/api/games?search=${name}`, (output) => {
        //Detailed info by id
        $.get(`https://api.rawg.io/api/games/${output.results[0].id}`, async (output) => {
            //Set title
            document.querySelectorAll('#selected-game-title').forEach((title) => {
                title.innerHTML = innerHTML = output.name;
            });
            //Set description
            document.getElementById('selected-game-description').innerHTML = output.description;

            //Show download size
            if (type == 'store') {
                $.get(`https://steamunlocked.net/${name}`, (output) => {
                    var pos = output.search('<em>Size:');
                    var pos2 = output.search('</em><br');
                    document.getElementById('selected-game-size').innerHTML = output.slice(pos + 10, pos2);
                });
            }

            //Add platforms / Release date
            document.querySelector('#platforms').innerHTML = '<h1 class="mdc-typography--headline5">Platforms</h1>';
            document.querySelector('#release-date').innerHTML = '<h1 class="mdc-typography--headline5">Release dates</h1>';
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
            document.querySelector('#publisher').innerHTML = '<h1 class="mdc-typography--headline5">Publishers</h1>';
            output.publishers.forEach((publishers) => {
                var publisherName = document.createElement('p');
                publisherName.innerHTML = publishers.name;
                document.querySelector('#publisher').appendChild(publisherName);
            });

            //Developers
            document.querySelector('#developer').innerHTML = '<h1 class="mdc-typography--headline5">Developers</h1>';
            output.developers.forEach((developers) => {
                var developerName = document.createElement('p');
                developerName.innerHTML = developers.name;
                document.querySelector('#developer').appendChild(developerName);
            });

            //genre
            document.querySelector('#genre').innerHTML = '<h1 class="mdc-typography--headline5">Genres</h1>';
            output.genres.forEach((genres) => {
                var genreName = document.createElement('p');
                genreName.innerHTML = genres.name;
                document.querySelector('#genre').appendChild(genreName);
            });

            //Age rating
            document.querySelector('#age-rating').innerHTML = '<h1 class="mdc-typography--headline5">Age ratings</h1>';
            var ageRating = document.createElement('p');
            try {
                ageRating.innerHTML = output.esrb_rating.name;
            } catch (e) {
                ageRating.innerHTML = 'Unkown';
            }
            document.querySelector('#age-rating').appendChild(ageRating);

            //Screenshots
            document.querySelector('#game-screenshots').innerHTML = '';
            $.get(`https://api.rawg.io/api/games/${output.id}/screenshots`, (screenshots) => {
                screenshots.results.forEach((screenshot) => {
                    var image = document.createElement('img');
                    image.src = screenshot.image;
                    document.querySelector('#game-screenshots').appendChild(image);
                });
            });
        }).then(async () => {
            document.getElementById('selected-game').style.display = 'initial';
            //Reset scroll
            $('#selected-game').scrollTop(0);
            hideProgressBar();
        });
    });
}
