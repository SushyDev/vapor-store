var progressBar = document.getElementById('MDCLinearProgress');

function showProgressBar() {
    progressBar.style.display = 'block';
}

function hideProgressBar() {
    progressBar.style.display = 'none';
}

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
    var anchorpoint = document.getElementById(`${name}-menu-anchorpoint`);
    if (!anchorpoint.innerHTML == '') {
        anchorpoint.closest('.mdc-card').style.zIndex = 'auto';
        anchorpoint.innerHTML = '';
    } else {
        anchorpoint.closest('.mdc-card').style.zIndex = '2';
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
