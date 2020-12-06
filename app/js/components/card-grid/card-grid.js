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
